import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { NewsPage } from '@/pages/news'

export const Route = createFileRoute('/news')({
  head: () => ({
    meta: [
      {
        title: 'Новости | XK HARDCORE',
      },
      {
        name: 'description',
        content: 'Лента новостей и постов сервера XK HARDCORE.',
      },
    ],
  }),
  component: NewsRoute,
})

function NewsRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/news' ? <NewsPage /> : <Outlet />
}