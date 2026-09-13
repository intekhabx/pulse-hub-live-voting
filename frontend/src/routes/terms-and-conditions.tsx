import { createFileRoute } from '@tanstack/react-router'
import TermsAndConditions from '../components/TermsAndConditions'

export const Route = createFileRoute('/terms-and-conditions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TermsAndConditions />
  )
}
