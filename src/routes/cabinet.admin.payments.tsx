import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin/payments')({
  head: () => ({
    meta: [
      {
        title: 'Покупки | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPage,
})
