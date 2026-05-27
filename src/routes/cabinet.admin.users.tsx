import { createFileRoute } from '@tanstack/react-router'
import { AdminUsersRoute } from '@/pages/admin/ui/routes/AdminUsersRoute'

export const Route = createFileRoute('/cabinet/admin/users')({
  head: () => ({
    meta: [
      {
        title: 'Пользователи | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminUsersRoute,
})
