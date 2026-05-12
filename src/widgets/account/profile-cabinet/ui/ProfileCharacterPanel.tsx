import { Card } from '@heroui/react'
import { SkinViewer } from '@/entities/account'
import type { AccountPayload } from '@/entities/account'

type ProfileCharacterPanelProps = {
  account: AccountPayload
}

export function ProfileCharacterPanel({ account }: ProfileCharacterPanelProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Персонаж</Card.Title>
        <Card.Description>А кто это у нас такой красивый?</Card.Description>
      </Card.Header>
      <Card.Content>
        <SkinViewer nickname={account.player.nickname} />
      </Card.Content>
    </Card>
  )
}
