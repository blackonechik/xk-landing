import { createFileRoute } from '@tanstack/react-router'
import { AdminPostsRoute } from '@/pages/admin/ui/routes/AdminPostsRoute'

export const Route = createFileRoute('/cabinet/admin/posts')({
  head: () => ({
    meta: [
      {
        title: 'Посты | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPostsRoute,
})
