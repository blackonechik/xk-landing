import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { CabinetNewsPage } from '@/pages/news'

export const Route = createFileRoute('/cabinet/news')({
  head: () => ({
    meta: [
      {
        title: 'Посты | XK HARDCORE',
      },
    ],
  }),
  component: CabinetNewsRoute,
})

function CabinetNewsRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/cabinet/news' ? <CabinetNewsPage /> : <Outlet />
}
