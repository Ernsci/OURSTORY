import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const NowContext = createContext<Date>(new Date())

export function NowProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const value = useMemo(() => now, [now])
  return <NowContext.Provider value={value}>{children}</NowContext.Provider>
}

export function useNow(): Date {
  return useContext(NowContext)
}