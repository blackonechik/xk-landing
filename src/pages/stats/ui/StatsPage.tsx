import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Card, Chip, Spinner, Text } from '@heroui/react'
import { Radio, Server, Trophy, UsersRound } from 'lucide-react'
import AnimatedLink from '@/components/AnimatedLink'
import {
  fetchAccountCached,
  getCachedAccount,
  PlayerAvatar,
  type AccountPayload,
} from '@/entities/account'
import {
  fetchPlayers,
  formatPlayedHours,
  type PublicPlayerProfile,
} from '@/entities/player'
import { AccountLayout } from '@/widgets/account/layout'

function getPercent(value: number, max: number) {
  if (max <= 0) {
    return 0
  }

  return Math.max(6, Math.round((value / max) * 100))
}

export function StatsPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountPayload | null>(() =>
    getCachedAccount(),
  )
  const [players, setPlayers] = useState<PublicPlayerProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadStatsPage() {
      try {
        const [nextAccount, nextPlayers] = await Promise.all([
          fetchAccountCached(),
          fetchPlayers(100),
        ])

        if (!isActive) {
          return
        }

        setAccount(nextAccount)
        setPlayers(nextPlayers)
        setError('')
      } catch (loadError) {
        if (!isActive) {
          return
        }

        if (loadError instanceof Error && loadError.message === 'UNAUTHORIZED') {
          await navigate({ to: '/login' })
          return
        }

        setError('Не получилось загрузить статистику PlayTimeManager.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadStatsPage()

    return () => {
      isActive = false
    }
  }, [navigate])

  const stats = useMemo(() => {
    const totalHours = players.reduce((sum, player) => sum + player.playedHours, 0)
    const onlineCount = players.filter((player) => player.isOnline).length
    const leader = players[0]

    return {
      leader,
      onlineCount,
      totalHours,
    }
  }, [players])

  const maxPlayedHours = stats.leader?.playedHours ?? 0

  if (!account) {
    return (
      <main className="xk-hero-scope min-h-svh bg-background px-4 pb-16 pt-28 text-foreground">
        <div className="mx-auto max-w-3xl">
          <Alert status="accent">
            <Alert.Indicator>
              <Spinner size="sm" />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>Загружаем кабинет</Alert.Title>
            </Alert.Content>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <AccountLayout
      account={account}
      currentSection="stats"
      onNavigate={(to) => {
        void navigate({ to })
      }}
      onBankViewNavigate={(view) => {
        void navigate({ to: `/cabinet/bank/${view}` })
      }}
      eyebrow="PlayTimeManager"
      title="Статистика"
      description="Игроки, онлайн и наигранное время из таблиц PlayTimeManager."
    >
      {isLoading ? (
        <Alert status="accent">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Загружаем статистику</Alert.Title>
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
        <div className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <Card className="overflow-hidden border border-[var(--separator)] bg-[var(--surface)]">
              <Card.Header className="flex items-start gap-4 p-5">
                <div className="grid size-[68px] shrink-0 place-items-center rounded-lg border border-[var(--separator)] bg-[var(--surface-secondary)]">
                  <Server size={30} />
                </div>
                <div className="min-w-0 flex-1">
                  <Card.Title>XK HARDCORE</Card.Title>
                  <Card.Description>
                    Общая статистика игрового сервера
                  </Card.Description>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip color="accent" variant="soft">
                      {stats.onlineCount} онлайн
                    </Chip>
                    <Chip variant="soft">{players.length} игроков</Chip>
                  </div>
                </div>
              </Card.Header>
              <Card.Content className="border-t border-[var(--separator)] p-0">
                <div className="grid grid-cols-1 divide-y divide-[var(--separator)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  <div className="p-5">
                    <Text color="muted" type="body-sm">
                      Игроков в статистике
                    </Text>
                    <Text className="mt-1 text-3xl font-semibold">
                      {players.length}
                    </Text>
                  </div>
                  <div className="p-5">
                    <Text color="muted" type="body-sm">
                      Сейчас онлайн
                    </Text>
                    <Text className="mt-1 text-3xl font-semibold">
                      {stats.onlineCount}
                    </Text>
                  </div>
                  <div className="p-5">
                    <Text color="muted" type="body-sm">
                      Всего наиграно
                    </Text>
                    <Text className="mt-1 text-3xl font-semibold">
                      {formatPlayedHours(stats.totalHours)}
                    </Text>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card className="border border-[var(--separator)] bg-[var(--surface)]">
              <Card.Header className="flex items-start justify-between gap-4 p-5">
                <div>
                  <Card.Description>Лидер</Card.Description>
                  <Card.Title>
                    {stats.leader?.nickname ?? 'нет данных'}
                  </Card.Title>
                </div>
                <Trophy className="text-muted" size={22} />
              </Card.Header>
              {stats.leader ? (
                <Card.Content className="p-5 pt-0">
                  <Text className="text-2xl font-semibold">
                    {formatPlayedHours(stats.leader.playedHours)}
                  </Text>
                </Card.Content>
              ) : null}
            </Card>
          </div>

          <Card className="border border-[var(--separator)] bg-[var(--surface)]">
            <Card.Header className="flex items-start justify-between gap-4 p-5">
              <div>
                <Card.Title>Игроки</Card.Title>
                <Card.Description>
                  Рейтинг по игровому времени из PlayTimeManager.
                </Card.Description>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <UsersRound size={18} />
                <Radio size={18} />
              </div>
            </Card.Header>
            <Card.Content className="p-5 pt-0">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] gap-4">
                {players.map((player) => (
                  <AnimatedLink
                    key={player.nickname}
                    className="group flex items-center gap-5 rounded-lg border border-[var(--separator)] p-5 transition-colors hover:bg-[var(--surface-secondary)]"
                    params={{ nickname: player.nickname }}
                    to="/u/$nickname"
                  >
                    <div className="relative size-14 shrink-0">
                      <PlayerAvatar
                        className="size-14 rounded-md border border-[var(--separator)] bg-[var(--surface-secondary)]"
                        nickname={player.nickname}
                      />
                      {player.isOnline ? (
                        <span
                          className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-[var(--surface)] bg-success"
                          title="Онлайн"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <Text className="truncate font-semibold">
                          {player.nickname}
                        </Text>
                      </div>
                      <Text color="muted" type="body-sm">
                        Наиграл:{' '}
                        <span className="font-semibold text-foreground">
                          {formatPlayedHours(player.playedHours)}
                        </span>
                      </Text>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{
                            width: `${getPercent(player.playedHours, maxPlayedHours)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </AnimatedLink>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </AccountLayout>
  )
}
