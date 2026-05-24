import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin/navigation')({
  head: () => ({
    meta: [
      {
        title: 'Навигация | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPage,
})
