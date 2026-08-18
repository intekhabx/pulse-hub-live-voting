import { createFileRoute, redirect } from '@tanstack/react-router'
import { ConfirmAccountLink } from '../../components/ConfirmAccountLink'
import tokenStore from '../../services/tokenStoreService';


export const Route = createFileRoute('/auth/confirm')({

  validateSearch: (search) => ({
    link_token: (search.link_token as string) ?? "",
    email: (search.email as string) ?? "",
  }),

  // /auth/callback route doesn't open after login
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
    <ConfirmAccountLink />
  )
}
