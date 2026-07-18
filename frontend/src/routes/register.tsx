import { createFileRoute, redirect } from '@tanstack/react-router';
import { Register } from '../components/Register';
import tokenStore from '../services/tokenStoreService';

export const Route = createFileRoute('/register')({
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
    <Register />
  )
}