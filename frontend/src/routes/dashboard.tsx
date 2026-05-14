import { createFileRoute, redirect } from '@tanstack/react-router'
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
  return <div>
    <Dashboard />
  </div>
}
