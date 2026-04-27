import { createFileRoute } from '@tanstack/react-router'
import { PaymentStatusPage, paymentMeta } from '@/pages/payment'

export const Route = createFileRoute('/payment/pending')({
  head: () => ({
    meta: [
      {
        title: `Ожидание оплаты | XK HARDCORE`,
      },
      {
        name: 'description',
        content: paymentMeta.description,
      },
    ],
  }),
  component: () => <PaymentStatusPage variant="pending" />,
})
