import { createFileRoute } from '@tanstack/react-router'
import { PlayersPage } from '@/pages/players'

export const Route = createFileRoute('/players')({
  head: () => ({
    meta: [
      {
        title: 'Игроки | XK HARDCORE',
      },
    ],
  }),
  component: PlayersPage,
})
