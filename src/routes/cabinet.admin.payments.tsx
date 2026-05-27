import { createFileRoute } from '@tanstack/react-router'
import { AdminPaymentsRoute } from '@/pages/admin/ui/routes/AdminPaymentsRoute'

export const Route = createFileRoute('/cabinet/admin/payments')({
  head: () => ({
    meta: [
      {
        title: 'Покупки | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminPaymentsRoute,
})
