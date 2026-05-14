import { useState } from 'react'
import { Alert, Button, ButtonGroup, Card, Text } from '@heroui/react'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import {
  ratePlayer,
  type PublicPlayerProfile,
} from '@/entities/player'

type ProfileRatingPanelProps = {
  player: PublicPlayerProfile
  isOwnProfile?: boolean
  onPlayerChange?: (player: PublicPlayerProfile) => void
}

function formatRatingCount(value: number) {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toLocaleString('ru-RU', {
      maximumFractionDigits: 1,
    })}K`
  }

  return value.toLocaleString('ru-RU')
}

export function ProfileRatingPanel({
  player,
  isOwnProfile = false,
  onPlayerChange,
}: ProfileRatingPanelProps) {
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)

  async function handleRate(value: -1 | 1) {
    if (isOwnProfile || isPending) {
      return
    }

    const nextValue = player.rating.currentUserRating === value ? 0 : value

    setIsPending(true)
    setError('')

    try {
      const nextPlayer = await ratePlayer(player.nickname, nextValue)
      onPlayerChange?.(nextPlayer)
    } catch (ratingError) {
      setError(
        ratingError instanceof Error && ratingError.message === 'UNAUTHORIZED'
          ? 'Войдите в аккаунт, чтобы оценивать игроков.'
          : 'Не получилось сохранить оценку.',
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <Card.Title>Оценки</Card.Title>
          <Card.Description>
            Репутация игрока по оценкам сообщества.
          </Card.Description>
        </div>
        <ButtonGroup variant="tertiary">
          <Button
            isDisabled={isOwnProfile || isPending}
            onPress={() => {
              void handleRate(1)
            }}
            variant={
              player.rating.currentUserRating === 1 ? 'secondary' : 'tertiary'
            }
          >
            <ThumbsUp size={16} />
            <span className="text-xs font-semibold">
              {formatRatingCount(player.rating.likes)}
            </span>
          </Button>
          <Button
            isDisabled={isOwnProfile || isPending}
            isIconOnly
            onPress={() => {
              void handleRate(-1)
            }}
            variant={
              player.rating.currentUserRating === -1 ? 'secondary' : 'tertiary'
            }
          >
            <ButtonGroup.Separator />
            <ThumbsDown size={16} />
          </Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Content className="grid gap-3">
        <Text color="muted" type="body-sm">
          Баланс оценок: {formatRatingCount(player.rating.score)}
        </Text>
        {isOwnProfile ? (
          <Text color="muted" type="body-sm">
            На своей странице можно видеть оценки, но нельзя оценивать себя.
          </Text>
        ) : null}
        {error ? (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{error}</Alert.Title>
            </Alert.Content>
          </Alert>
        ) : null}
      </Card.Content>
    </Card>
  )
}
