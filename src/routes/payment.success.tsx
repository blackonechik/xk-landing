import { createFileRoute } from '@tanstack/react-router'
import { PaymentStatusPage, paymentMeta } from '@/pages/payment'

export const Route = createFileRoute('/payment/success')({
  head: () => ({
    meta: [
      {
        title: `Оплата успешна | XK HARDCORE`,
      },
      {
        name: 'description',
        content: paymentMeta.description,
      },
    ],
  }),
  component: () => <PaymentStatusPage variant="success" />,
})
