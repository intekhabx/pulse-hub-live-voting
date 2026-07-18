import { createFileRoute, redirect } from '@tanstack/react-router'
import Login from '../components/Login';
import tokenStore from '../services/tokenStoreService';


export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const accessToken = tokenStore.getAccessToken();

    if (accessToken) {
      throw redirect({ to: '/dashboard' });
    }
  },

  component: RouteComponent,
})


function RouteComponent() {
  return (
    <Login />
  )
}
