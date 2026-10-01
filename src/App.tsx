import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Backdrop } from './components/Backdrop'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Footer } from './components/Footer'
import { LightboxProvider } from './components/Lightbox'
import { Nav } from './components/Nav'
import { ScrollToTop } from './components/ScrollToTop'
import { ContentProvider } from './hooks/useContent'
import { NowProvider } from './hooks/useNow'
import { PhotoLibraryProvider } from './hooks/usePhotoLibrary'
import { Home } from './pages/Home'
import { Letters } from './pages/Letters'
import { Moments } from './pages/Moments'
import { Monthsary } from './pages/Monthsary'
import { NotFound } from './pages/NotFound'
import { Timeline } from './pages/Timeline'
import { Us } from './pages/Us'

const Admin = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })))

function AdminGate() {
  return (
    <Suspense
      fallback={
        <p className="py-20 text-center font-mono text-xs tracking-[0.2em] text-ink-soft uppercase">
          Opening the admin page…
        </p>
      }
    >
      <Admin />
    </Suspense>
  )
}

export function App() {
  return (
    <NowProvider>
      <ContentProvider>
        <PhotoLibraryProvider>
          <LightboxProvider>
            <div className="flex min-h-screen flex-col">
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-rose-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
              >
                Skip to content
              </a>
              <Backdrop />
              <ScrollToTop />
              <Nav />
              <ErrorBoundary>
                <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-10">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/moments" element={<Moments />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/monthsary" element={<Monthsary />} />
                    <Route path="/us" element={<Us />} />
                    <Route path="/letters" element={<Letters />} />
                    <Route path="/admin" element={<AdminGate />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </ErrorBoundary>
              <Footer />
            </div>
          </LightboxProvider>
        </PhotoLibraryProvider>
      </ContentProvider>
    </NowProvider>
  )
}