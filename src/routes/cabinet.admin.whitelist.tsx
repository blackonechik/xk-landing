import { createFileRoute } from '@tanstack/react-router'
import { AdminWhitelistRoute } from '@/pages/admin/ui/routes/AdminWhitelistRoute'

export const Route = createFileRoute('/cabinet/admin/whitelist')({
  head: () => ({
    meta: [
      {
        title: 'Whitelist | Админка XK HARDCORE',
      },
    ],
  }),
  component: AdminWhitelistRoute,
})
