import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Alert, Button, ButtonGroup, Card, Chip, Spinner, Text } from '@heroui/react'
import { Clock3, Crown, Server } from 'lucide-react'
import {
  PlayerAvatar,
  fetchAccountCached,
  getCachedAccount,
} from '@/entities/account'
import type { AccountPayload } from '@/entities/account'
import { fetchPlayers, formatPlayedHours } from '@/entities/player'
import type { PublicPlayerProfile } from '@/entities/player'
import { AccountLayout } from '@/widgets/account/layout'

type StatsPeriod = 'all' | 'month' | 'week'

const periodLabels: Record<StatsPeriod, string> = {
  all: 'За всё время',
  month: 'За месяц',
  week: 'За неделю',
}

function getHoursByPeriod(player: PublicPlayerProfile, period: StatsPeriod) {
  if (period === 'month') {
    return player.stats.monthHours
  }

  if (period === 'week') {
    return player.stats.weekHours
  }

  return player.stats.totalHours
}

export function StatsPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountPayload | null>(() =>
    getCachedAccount(),
  )
  const [players, setPlayers] = useState<PublicPlayerProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState<StatsPeriod>('all')

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
    const totalHours = players.reduce((sum, player) => sum + player.stats.totalHours, 0)
    const monthHours = players.reduce((sum, player) => sum + player.stats.monthHours, 0)
    const weekHours = players.reduce((sum, player) => sum + player.stats.weekHours, 0)
    const onlineCount = players.filter((player) => player.isOnline).length

    return {
      monthHours,
      onlineCount,
      totalHours,
      weekHours,
    }
  }, [players])

  const rankedPlayers = useMemo(
    () =>
      [...players]
        .sort(
          (left, right) =>
            getHoursByPeriod(right, period) - getHoursByPeriod(left, period),
        )
        .filter((player) => getHoursByPeriod(player, period) > 0 || period === 'all'),
    [period, players],
  )

  const leader = rankedPlayers.at(0) ?? null
  const totalForCurrentPeriod =
    period === 'month'
      ? stats.monthHours
      : period === 'week'
        ? stats.weekHours
        : stats.totalHours

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
      title="Статистика"
      description="Игроки, онлайн и рейтинг по игровому времени"
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
                      {periodLabels[period]}
                    </Text>
                    <Text className="mt-1 text-3xl font-semibold">
                      {formatPlayedHours(totalForCurrentPeriod)}
                    </Text>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card className="border border-[var(--separator)] bg-[var(--surface)]">
              <Card.Content>
                <Text className="text-muted">Лидер периода:</Text>
                {leader ? (
                  <div className="mt-3 flex items-center justify-between gap-5">
                    <div className="min-w-0">
                      <Card.Title>{leader.nickname}</Card.Title>
                      <Text className="mt-1" color="muted" type="body-sm">
                        {periodLabels[period]}: {formatPlayedHours(getHoursByPeriod(leader, period))}
                      </Text>
                    </div>
                    <PlayerAvatar
                      size="lg"
                      nickname={leader.nickname}
                    />
                  </div>
                ) : (
                  <Text className="mt-3" color="muted" type="body-sm">
                    Для этого периода пока нет данных.
                  </Text>
                )}
              </Card.Content>
            </Card>
          </div>

          <Card className="border border-[var(--separator)] bg-[var(--surface)]">
            <Card.Header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <Card.Title>Игроки</Card.Title>
                <Card.Description>
                  Рейтинг по игровому времени
                </Card.Description>
              </div>
              <ButtonGroup variant="tertiary">
                {(['all', 'month', 'week'] as const).map((option) => (
                  <Button
                    key={option}
                    variant={period === option ? 'secondary' : 'tertiary'}
                    onPress={() => {
                      setPeriod(option)
                    }}
                  >
                    {periodLabels[option]}
                  </Button>
                ))}
              </ButtonGroup>
            </Card.Header>
            <Card.Content className="grid gap-3 p-5 pt-0 sm:grid-cols-2 xl:grid-cols-4">
              {rankedPlayers.map((player, index) => (
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
                        <Crown
                          className="shrink-0 text-[var(--accent)]"
                          size={15}
                        />
                      ) : null}
                    </div>
                    <Text
                      className="mt-1 flex items-center gap-1.5"
                      color="muted"
                      type="body-sm"
                    >
                      <Clock3 size={14} />
                      Наиграл:{' '}
                      <span>{formatPlayedHours(getHoursByPeriod(player, period))}</span>
                    </Text>
                  </div>
                </Link>
              ))}
            </Card.Content>
          </Card>
        </div>
      )}
    </AccountLayout>
  )
}
