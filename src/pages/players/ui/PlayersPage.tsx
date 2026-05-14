import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Alert, Card, Chip, Spinner, Text } from '@heroui/react'
import { Clock3, Crown, Server } from 'lucide-react'
import { PlayerAvatar } from '@/entities/account'
import {
  fetchPlayers,
  formatPlayedHours,
  type PublicPlayerProfile,
} from '@/entities/player'
import { HeroPage } from '@/shared/ui/hero-page'

export function PlayersPage() {
  const [players, setPlayers] = useState<PublicPlayerProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    void fetchPlayers()
      .then((nextPlayers) => {
        if (isActive) {
          setPlayers(nextPlayers)
          setError('')
        }
      })
      .catch(() => {
        if (isActive) {
          setError('Не получилось загрузить игроков.')
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  return (
    <HeroPage
      eyebrow="Игроки"
      title="Игроки XK HARDCORE"
      description="Профили игроков, их активность и время на сервере."
    >
      <Card>
        <Card.Header className="flex items-start justify-between gap-4">
          <div>
            <Card.Title>Топ по времени</Card.Title>
            <Card.Description>
              Нажмите на игрока, чтобы открыть публичный профиль.
            </Card.Description>
          </div>
          <Chip color="accent" variant="soft">
            {players.length} игроков
          </Chip>
        </Card.Header>
        <Card.Content>
          {isLoading ? (
            <Alert status="accent">
              <Alert.Indicator>
                <Spinner size="sm" />
              </Alert.Indicator>
              <Alert.Content>
                <Alert.Title>Загружаем список игроков</Alert.Title>
              </Alert.Content>
            </Alert>
          ) : error ? (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{error}</Alert.Title>
              </Alert.Content>
            </Alert>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {players.map((player, index) => (
                <Link
                  key={player.nickname}
                  className="group flex items-center gap-4 rounded-lg border border-[var(--separator)] bg-[var(--surface)] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)]"
                  params={{ nickname: player.nickname }}
                  to="/u/$nickname"
                >
                  <div className="relative shrink-0">
                    <PlayerAvatar
                      alt={player.nickname}
                      className="size-14 border border-white/10 bg-black/20"
                      nickname={player.nickname}
                    />
                    <span
                      className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border border-[var(--surface)] bg-[var(--accent)] text-[var(--accent-foreground)] shadow"
                      title="XK HARDCORE"
                    >
                      <Server size={11} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Text className="truncate" type="body" weight="semibold">
                        {player.nickname}
                      </Text>
                      {index < 3 ? (
                        <Crown className="shrink-0 text-[var(--accent)]" size={15} />
                      ) : null}
                    </div>
                    <Text
                      className="mt-1 flex items-center gap-1.5"
                      color="muted"
                      type="body-sm"
                    >
                      <Clock3 size={14} />
                      Наиграл: <span>{formatPlayedHours(player.playedHours)}</span>
                    </Text>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </HeroPage>
  )
}
