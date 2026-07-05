import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function RootLayout() {
  const pathname = useRouterState({
    select: s => s.location.pathname,
  })

  // dashboard pe hide (optional)
  const hideLayout = pathname.startsWith('/dashboard')

  return (
    <>
      {!hideLayout && <Navbar />}

      <Outlet />

      {!hideLayout && <Footer />}
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})