import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "../../../components/Dashboard";
import tokenStore from "../../../services/tokenStoreService";

export const Route = createFileRoute("/dashboard/poll/$pollId")({
  beforeLoad: () => {
    if (!tokenStore.getAccessToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { pollId } = Route.useParams();
  return <Dashboard pollId={pollId} />;
}
