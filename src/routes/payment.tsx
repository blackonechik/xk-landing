import { createFileRoute } from '@tanstack/react-router'
import { PaymentPage, paymentMeta } from '@/pages/payment'

export const Route = createFileRoute('/payment')({
  head: () => ({
    meta: [
      {
        title: paymentMeta.title,
      },
      {
        name: 'description',
        content: paymentMeta.description,
      },
    ],
  }),
  component: PaymentPage,
})
