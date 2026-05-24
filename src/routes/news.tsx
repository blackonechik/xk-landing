import { createFileRoute } from '@tanstack/react-router'
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
  component: NewsPage,
})