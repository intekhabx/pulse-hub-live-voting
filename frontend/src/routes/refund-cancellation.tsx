import { createFileRoute } from '@tanstack/react-router'
import RefundCancellation from '../components/RefundCancellation'

export const Route = createFileRoute('/refund-cancellation')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RefundCancellation />
  )
}
