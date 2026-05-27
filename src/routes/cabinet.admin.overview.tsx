import { createFileRoute } from '@tanstack/react-router'
import { AdminOverviewRoute } from '@/pages/admin/ui/routes/AdminOverviewRoute'

export const Route = createFileRoute('/cabinet/admin/overview')({
  head: () => ({
    meta: [
      {
        title: 'Обзор | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminOverviewRoute,
})
