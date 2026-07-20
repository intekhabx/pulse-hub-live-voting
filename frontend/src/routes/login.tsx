import { createFileRoute, redirect } from '@tanstack/react-router'
import Login from '../components/Login';
import tokenStore from '../services/tokenStoreService';


export const Route = createFileRoute('/login')({

  validateSearch: (search)=> ({
    next: search.next as string | undefined,
  }),

  beforeLoad: ({search}) => {
    const accessToken = tokenStore.getAccessToken();

    if (accessToken) {
      throw redirect({ to: search.next || '/dashboard' });
    }
  },

  component: RouteComponent,
})


function RouteComponent() {
  return (
    <Login />
  )
}
