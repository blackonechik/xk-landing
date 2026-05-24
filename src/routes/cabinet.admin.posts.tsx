import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin/posts')({
  head: () => ({
    meta: [
      {
        title: 'Посты | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPage,
})
