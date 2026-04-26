import { createFileRoute } from '@tanstack/react-router'
import { HomePage, homeMeta } from '@/pages/home'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: homeMeta.title,
      },
      {
        name: 'description',
        content: homeMeta.description,
      },
    ],
  }),
  component: HomePage,
})
