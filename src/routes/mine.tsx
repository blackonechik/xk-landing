import { createFileRoute } from '@tanstack/react-router'
import { MinePage } from '@/pages/mine'

export const Route = createFileRoute('/mine')({
  head: () => ({
    meta: [
      {
        title: 'Шахта | XK HARDCORE',
      },
      {
        name: 'description',
        content: 'Моковая Telegram WebApp мини-игра Шахта в Minecraft UI стиле.',
      },
    ],
  }),
  component: MinePage,
})
