import { useState } from 'react'
import { Button, ButtonGroup } from '@heroui/react'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import type { PublicPlayerProfile } from '@/entities/player'
import { ratePlayer } from '@/entities/player'

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
    <div className="flex flex-wrap items-center gap-2">
      <ButtonGroup
        aria-label={
          error
            ? error
            : `Оценки игрока: ${formatRatingCount(player.rating.score)}`
        }
        variant="tertiary"
      >
        <Button
          isDisabled={isOwnProfile || isPending}
          onPress={() => {
            void handleRate(1)
          }}
          title="Нравится"
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
          onPress={() => {
            void handleRate(-1)
          }}
          title="Не нравится"
          variant={
            player.rating.currentUserRating === -1 ? 'secondary' : 'tertiary'
          }
        >
          <ButtonGroup.Separator />
          <ThumbsDown size={16} />
          <span className="text-xs font-semibold">
            {formatRatingCount(player.rating.dislikes)}
          </span>
        </Button>
      </ButtonGroup>
      <span className="text-xs font-semibold text-muted-foreground">
        Рейтинг:{' '}
        <span
          className={
            player.rating.score < 0 ? 'text-danger' : 'text-foreground'
          }
        >
          {player.rating.score > 0 ? '+' : ''}
          {formatRatingCount(player.rating.score)}
        </span>
      </span>
    </div>
  )
}
