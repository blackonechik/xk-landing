import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin/applications')({
  head: () => ({
    meta: [
      {
        title: 'Заявки | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPage,
})
