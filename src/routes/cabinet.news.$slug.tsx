import { createFileRoute } from '@tanstack/react-router'
import { CabinetNewsPostPage } from '@/pages/news'

export const Route = createFileRoute('/cabinet/news/$slug')({
  head: () => ({
    meta: [
      {
        title: 'Пост | XK HARDCORE',
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()

  return <CabinetNewsPostPage slug={slug} />
}
