import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function RootLayout() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const isAuthPage = ['/login', '/register', '/dashboard'].includes(pathname)

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Outlet />
      {!isAuthPage && <Footer />}
    </>
  )
}

export const Route = createRootRoute({ component: RootLayout })