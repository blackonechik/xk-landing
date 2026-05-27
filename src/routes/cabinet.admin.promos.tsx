import { createFileRoute } from '@tanstack/react-router'
import { AdminPromosRoute } from '@/pages/admin/ui/routes/AdminPromosRoute'

export const Route = createFileRoute('/cabinet/admin/promos')({
  head: () => ({
    meta: [
      {
        title: 'Промокоды | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPromosRoute,
})
