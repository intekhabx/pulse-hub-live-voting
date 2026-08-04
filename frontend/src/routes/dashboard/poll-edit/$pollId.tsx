import { createFileRoute, redirect } from '@tanstack/react-router'
import Dashboard from '../../../components/Dashboard';
import tokenStore from '../../../services/tokenStoreService';

export const Route = createFileRoute('/dashboard/poll-edit/$pollId')({
  beforeLoad: () => {
    if (!tokenStore.getAccessToken()) {
      throw redirect({ to: "/login" });
    }
  },
  validateSearch: (search) => ({
    mode: search.mode === 'edit' ? 'edit' : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { pollId } = Route.useParams();
  const { mode } = Route.useSearch();
  return <Dashboard pollId={pollId} editMode={mode === 'edit'} />;

}
