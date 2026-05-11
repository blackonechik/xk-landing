import { createFileRoute } from '@tanstack/react-router'
import { CabinetBankPage } from '@/pages/account'

export const Route = createFileRoute('/cabinet/bank')({
  head: () => ({
    meta: [
      {
        title: 'XK Bank | XK HARDCORE',
      },
    ],
  }),
  component: CabinetBankPage,
})