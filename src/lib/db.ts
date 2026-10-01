export interface UploadedPhoto {
  id: string
  blob: Blob
  filename: string
  date: number
  caption: string | null
}

const DB_NAME = 'chaddy-and-rei'
const DB_VERSION = 1
const STORE = 'photos'

let dbPromise: Promise<IDBDatabase> | null = null

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('This browser has no IndexedDB support, so uploads cannot be stored.'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open the photo database.'))
  })
  dbPromise.catch(() => {
    dbPromise = null
  })
  return dbPromise
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const request = work(tx.objectStore(STORE))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error ?? new Error('Photo database request failed.'))
        tx.onabort = () => reject(tx.error ?? new Error('Photo database transaction aborted.'))
      }),
  )
}

export async function listUploads(): Promise<UploadedPhoto[]> {
  const rows = await runTransaction<UploadedPhoto[]>('readonly', (store) => store.getAll())
  return rows.sort((a, b) => b.date - a.date)
}

export async function saveUpload(file: File, caption: string | null): Promise<UploadedPhoto> {
  const record: UploadedPhoto = {
    id: `upload:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    blob: file,
    filename: file.name,
    date: file.lastModified || Date.now(),
    caption,
  }
  await runTransaction('readwrite', (store) => store.put(record))
  return record
}

export async function removeUpload(id: string): Promise<void> {
  await runTransaction('readwrite', (store) => store.delete(id))
}