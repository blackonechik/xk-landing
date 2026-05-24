import { createFileRoute } from '@tanstack/react-router'
import { NewsPostPage } from '@/pages/news'

export const Route = createFileRoute('/news/$slug')({
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.slug} | XK HARDCORE`,
      },
    ],
  }),
  component: NewsPostRoute,
})

function NewsPostRoute() {
  const { slug } = Route.useParams()

  return <NewsPostPage slug={slug} />
}