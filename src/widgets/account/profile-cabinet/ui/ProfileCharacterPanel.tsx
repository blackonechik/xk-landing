import { Avatar, Card } from '@heroui/react'
import { UserRound } from 'lucide-react'
import { SkinViewer } from '@/entities/account'
import type { AccountPayload } from '@/entities/account'

type ProfileCharacterPanelProps = {
  account: AccountPayload
}

export function ProfileCharacterPanel({ account }: ProfileCharacterPanelProps) {
  const skinUuid = account.player.premiumUuid ?? account.player.uuid
  const avatarUrl = `https://api.mcheads.org/head/${encodeURIComponent(
    account.player.nickname,
  )}/64`

  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <Card.Title>Персонаж</Card.Title>
          <Card.Description>{account.player.nickname}</Card.Description>
        </div>
        <Avatar>
          <Avatar.Image alt="" src={avatarUrl} />
          <Avatar.Fallback>
            <UserRound size={18} />
          </Avatar.Fallback>
        </Avatar>
      </Card.Header>
      <Card.Content>
        <SkinViewer nickname={account.player.nickname} uuid={skinUuid} />
      </Card.Content>
    </Card>
  )
}
