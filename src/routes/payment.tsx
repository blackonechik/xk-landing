import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
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
  component: PaymentRoute,
})

function PaymentRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/payment' ? <PaymentPage /> : <Outlet />
}
