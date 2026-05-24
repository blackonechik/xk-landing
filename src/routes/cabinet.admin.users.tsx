import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin/users')({
  head: () => ({
    meta: [
      {
        title: 'Пользователи | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPage,
})
