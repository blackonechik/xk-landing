import { createFileRoute } from '@tanstack/react-router'
import { PaymentStatusPage, paymentMeta } from '@/pages/payment'

export const Route = createFileRoute('/payment/failed')({
  head: () => ({
    meta: [
      {
        title: `Оплата не прошла | XK HARDCORE`,
      },
      {
        name: 'description',
        content: paymentMeta.description,
      },
    ],
  }),
  component: () => <PaymentStatusPage variant="failed" />,
})
