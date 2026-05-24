import { createFileRoute } from '@tanstack/react-router'
import { CabinetNewsPage } from '@/pages/news'

export const Route = createFileRoute('/cabinet/news')({
  head: () => ({
    meta: [
      {
        title: 'Посты | XK HARDCORE',
      },
    ],
  }),
  component: CabinetNewsPage,
})
