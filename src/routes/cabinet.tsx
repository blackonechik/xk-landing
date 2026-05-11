import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { CabinetPage } from '@/pages/account'

export const Route = createFileRoute('/cabinet')({
  head: () => ({
    meta: [
      {
        title: 'Профиль | XK HARDCORE',
      },
    ],
  }),
  component: CabinetRoute,
})

function CabinetRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/cabinet' ? <CabinetPage /> : <Outlet />
}
