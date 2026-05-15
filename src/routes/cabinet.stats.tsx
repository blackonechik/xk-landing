import { createFileRoute } from '@tanstack/react-router'
import { StatsPage } from '@/pages/stats'

export const Route = createFileRoute('/cabinet/stats')({
  head: () => ({
    meta: [
      {
        title: 'Статистика | XK HARDCORE',
      },
    ],
  }),
  component: StatsPage,
})
