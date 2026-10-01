import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Photo } from '../data/photos'
import { humanDate } from '../utils/date'

interface LightboxContextValue {
  open: (photos: Photo[], index: number) => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox() {
  const context = useContext(LightboxContext)
  if (!context) throw new Error('useLightbox must be used inside LightboxProvider')
  return context
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [openState, setOpenState] = useState<{ photos: Photo[]; index: number } | null>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  const open = useCallback((photos: Photo[], index: number) => {
    restoreFocus.current = document.activeElement as HTMLElement | null
    setOpenState({ photos, index })
  }, [])

  const close = useCallback(() => setOpenState(null), [])

  const current = openState?.photos[openState.index]
  const currentLabel = current ? (current.date ? `Photo from ${humanDate(current.date)}` : 'Photo') : 'Photo'

  const step = useCallback((delta: number) => {
    setOpenState((state) => {
      if (!state || state.photos.length === 0) return state
      const next = (state.index + delta + state.photos.length) % state.photos.length
      return { ...state, index: next }
    })
  }, [])

  useEffect(() => {
    if (!openState) return
    closeButton.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      } else if (event.key === 'Tab' && dialog.current) {
        const focusable = dialog.current.querySelectorAll<HTMLElement>('button')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      restoreFocus.current?.focus?.()
    }
  }, [openState, close, step])

  const value: LightboxContextValue = { open }

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {openState && current && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={currentLabel}
          className="fixed inset-0 z-50 flex flex-col bg-ink/85 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-paper">
            <p className="font-mono text-xs tracking-[0.2em] uppercase">
              {openState.index + 1} / {openState.photos.length}
            </p>
            <button
              ref={closeButton}
              type="button"
              onClick={close}
              className="rounded-full border border-paper/40 px-4 py-1.5 font-mono text-xs tracking-[0.2em] uppercase hover:bg-paper/10"
            >
              Close
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center gap-4 px-4 pb-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="shrink-0 rounded-full border border-paper/40 px-3 py-6 text-lg hover:bg-paper/10"
            >
              ←
            </button>
            <img
              src={current.src}
              alt={currentLabel}
              className="max-h-full min-h-0 max-w-full rounded-lg object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="shrink-0 rounded-full border border-paper/40 px-3 py-6 text-lg hover:bg-paper/10"
            >
              →
            </button>
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  )
}