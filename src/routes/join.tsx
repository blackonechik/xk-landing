import { createFileRoute } from '@tanstack/react-router'
import { JoinPage } from '@/pages/join'

export const Route = createFileRoute('/join')({
  head: () => ({
    meta: [
      {
        title: 'Анкета на вступление | XK HARDCORE',
      },
      {
        name: 'description',
        content: 'Анкета для подачи заявки на вступление в сервер XK HARDCORE.',
      },
    ],
  }),
  component: JoinPage,
})