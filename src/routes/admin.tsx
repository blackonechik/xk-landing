import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      {
        title: 'Админка XK HARDCORE',
      },
      {
        name: 'description',
        content: 'Админка для просмотра платежей и логов начисления жизней.',
      },
    ],
  }),
  component: AdminPage,
})
