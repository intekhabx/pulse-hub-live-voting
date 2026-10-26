import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { useContext } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { DataContext } from '../Context/ContextApi'
import SettingContextProvider from '../Context/SettingContext'

function RootLayout() {
  const context = useContext(DataContext)
  const pathname = useRouterState({
    select: s => s.location.pathname,
  })

  // dashboard pe hide (optional)
  const hideLayout = pathname.startsWith('/dashboard')
  const isVotePage = pathname.startsWith('/votes/')

  return (
    <>
      <SettingContextProvider>
        {!hideLayout && <Navbar hideNavigationLinks={isVotePage} />}

        <Outlet />

        {!hideLayout && !(isVotePage && (context?.brandingLoading || context?.customBranding)) && <Footer />}
      </SettingContextProvider>
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
