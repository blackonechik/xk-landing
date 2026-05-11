import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/account'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      {
        title: 'Вход в личный кабинет | XK HARDCORE',
      },
    ],
  }),
  component: LoginPage,
})
