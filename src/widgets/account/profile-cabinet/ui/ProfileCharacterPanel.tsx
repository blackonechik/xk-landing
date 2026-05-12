import { Card } from '@heroui/react'
import { SkinViewer } from '@/entities/account'
import type { AccountPayload } from '@/entities/account'

type ProfileCharacterPanelProps = {
  account: AccountPayload
}

export function ProfileCharacterPanel({ account }: ProfileCharacterPanelProps) {
  const skinUuid = account.player.premiumUuid ?? account.player.uuid

  return (
    <Card>
      <Card.Header>
        <Card.Title>Персонаж</Card.Title>
        <Card.Description>Скин и аватар игрока загружаются из базы через skin proxy.</Card.Description>
      </Card.Header>
      <Card.Content>
        <SkinViewer nickname={account.player.nickname} uuid={skinUuid} />
      </Card.Content>
    </Card>
  )
}
