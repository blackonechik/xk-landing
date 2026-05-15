import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/stats')({
  beforeLoad: () => {
    throw redirect({ to: '/cabinet/stats' })
  },
  head: () => ({
    meta: [
      {
        title: 'Статистика | XK HARDCORE',
      },
    ],
  }),
})
