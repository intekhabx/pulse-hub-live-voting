import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/poll')({
  component: PollPage,
})

function PollPage() {
  const { pollId } = Route.useParams()

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Vote Page</h1>
        <p className="text-gray-400 mt-2">Poll ID: {pollId}</p>
      </div>
    </div>
  )
}