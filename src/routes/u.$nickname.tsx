import { createFileRoute } from '@tanstack/react-router'
import { PublicPlayerPage } from '@/pages/players'

export const Route = createFileRoute('/u/$nickname')({
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.nickname} | XK HARDCORE`,
      },
    ],
  }),
  component: PlayerRoute,
})

function PlayerRoute() {
  const { nickname } = Route.useParams()

  return <PublicPlayerPage nickname={nickname} />
}
