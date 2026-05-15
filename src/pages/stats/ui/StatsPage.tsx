import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Alert, Card, Chip, Spinner, Text } from '@heroui/react'
import { Clock3, Crown, Radio, Server, UsersRound } from 'lucide-react'
import {
  fetchAccountCached,
  getCachedAccount,
  PlayerAvatar
  
} from '@/entities/account'
import type {AccountPayload} from '@/entities/account';
import {
  fetchPlayers,
  formatPlayedHours
  
} from '@/entities/player'
import type {PublicPlayerProfile} from '@/entities/player';
import { AccountLayout } from '@/widgets/account/layout'

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
    const leader = players.at(0) ?? null

    return {
      leader,
      onlineCount,
      totalHours,
    }
  }, [players])

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
      description="Игроки, онлайн и наигранное время"
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
                      Всего игроков
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
              <Card.Content>
                <Text className="text-muted">Лидер по игровому времени:</Text>
                {stats.leader ? (
                  <div className="flex flex-row items-center justify-between gap-5">
                    <div>
                      <Card.Title>{stats.leader.nickname}</Card.Title>
                      <PlayerAvatar
                        size="lg"
                        nickname={stats.leader.nickname}
                      />
                    </div>
                    <Text className="text-2xl font-semibold">
                      {formatPlayedHours(stats.leader.playedHours)}
                    </Text>
                  </div>
                ) : (
                  <Text className="mt-3" color="muted" type="body-sm">
                    Пока нет данных по игрокам.
                  </Text>
                )}
              </Card.Content>
            </Card>
          </div>

          <Card className="border border-[var(--separator)] bg-[var(--surface)]">
            <Card.Header className="flex items-start justify-between">
                <Card.Title>Игроки</Card.Title>
                <Card.Description>
                  Рейтинг по игровому времени
                </Card.Description>
            </Card.Header>
            <Card.Content className="p-5 pt-0">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
            </Card.Content>
          </Card>
        </div>
      )}
    </AccountLayout>
  )
}
