import { createFileRoute } from '@tanstack/react-router'
import { AdminApplicationsRoute } from '@/pages/admin/ui/routes/AdminApplicationsRoute'

export const Route = createFileRoute('/cabinet/admin/applications')({
  head: () => ({
    meta: [
      {
        title: 'Заявки | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminApplicationsRoute,
})
