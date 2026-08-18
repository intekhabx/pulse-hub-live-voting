import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthCallback } from '../../components/AuthCallback'
import tokenStore from '../../services/tokenStoreService';

export const Route = createFileRoute('/auth/callback')({

  validateSearch: (search) => ({
    otp: (search.otp as string) ?? "",
    next: search.next as string | undefined,
  }),

  // /auth/callback route dones'nt open after login
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
    <AuthCallback />
  )
}