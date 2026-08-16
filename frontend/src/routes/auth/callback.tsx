import { createFileRoute } from '@tanstack/react-router'
import { AuthCallback } from '../../components/AuthCallback'

export const Route = createFileRoute('/auth/callback')({

  validateSearch: (search) => ({
    otp: (search.otp as string) ?? "",
    next: search.next as string | undefined,
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthCallback />
  )
}