import { createFileRoute } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin')({
  head: () => ({
    meta: [
      {
        title: 'Админка | XK HARDCORE',
      },
      {
        name: 'description',
        content: 'Админские разделы внутри личного кабинета XK HARDCORE.',
      },
    ],
  }),
  component: AdminPage,
})