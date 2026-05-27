import { createFileRoute } from '@tanstack/react-router'
import { AdminNavigationRoute } from '@/pages/admin/ui/routes/AdminNavigationRoute'

export const Route = createFileRoute('/cabinet/admin/navigation')({
  head: () => ({
    meta: [
      {
        title: 'Навигация | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminNavigationRoute,
})
