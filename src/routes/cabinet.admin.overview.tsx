import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin/overview')({
  head: () => ({
    meta: [
      {
        title: 'Обзор | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPage,
})
