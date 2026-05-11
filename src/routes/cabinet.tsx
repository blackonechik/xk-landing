import { createFileRoute } from '@tanstack/react-router'
import { CabinetPage } from '@/pages/account'

export const Route = createFileRoute('/cabinet')({
  head: () => ({
    meta: [
      {
        title: 'Профиль | XK HARDCORE',
      },
    ],
  }),
  component: CabinetPage,
})
