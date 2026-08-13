import { createFileRoute, redirect } from '@tanstack/react-router'
import { VerifyOtp } from '../components/VerifyOtp'
import tokenStore from '../services/tokenStoreService';

export const Route = createFileRoute('/verify-otp')({

  validateSearch: (search) => ({
    email: (search.email as string) ?? "",
    next: search.next as string | undefined,
  }),

  beforeLoad: ({ search }) => {
    const accessToken = tokenStore.getAccessToken();

    if (accessToken) {
      throw redirect({ to: search.next || '/dashboard' });
    }
  },

  component: RouteComponent,
})

function RouteComponent() {
  return (
    <VerifyOtp />
  )
}
