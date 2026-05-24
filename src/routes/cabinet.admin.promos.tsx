import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin/promos')({
  head: () => ({
    meta: [
      {
        title: 'Промокоды | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPage,
})
