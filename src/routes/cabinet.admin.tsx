import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminPage } from '@/pages/admin'

export const Route = createFileRoute('/cabinet/admin')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/cabinet/admin') {
      throw redirect({ to: '/cabinet/admin/overview' })
    }
  },
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
