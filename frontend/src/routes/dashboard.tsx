import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import Dashboard from '../components/Dashboard'
import tokenStore from '../services/tokenStoreService';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
  const accessToken = tokenStore.getAccessToken();

  if (!accessToken) {
    throw redirect({ to: "/login" });
  }
},

  component: RouteComponent,
})

function RouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return pathname === "/dashboard" ? <Dashboard /> : <Outlet />;
}
