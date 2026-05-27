import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Alert, Card, Chip, Spinner, Text } from '@heroui/react'
import { Clock3, Crown, Server } from 'lucide-react'
import {
  PlayerAvatar,
  fetchAccountCached,
  getCachedAccount,
} from '@/entities/account'
import type { AccountPayload } from '@/entities/account'
import { fetchPlayers, formatPlayedHours } from '@/entities/player'
import type {
  PlayerDailyActivity,
  PublicPlayerProfile,
} from '@/entities/player'
import { AccountLayout } from '@/widgets/account/layout'

const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
})

const weekdayLabels = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
] as const

type ActivityBreakdownItem = {
  label: string
  shortLabel: string
  hours: number
}

function parseActivityDate(value: string) {
  return new Date(`${value}T12:00:00`)
}

function buildMonthStats(players: PublicPlayerProfile[]) {
  const hoursByMonth = new Map<number, number>()

  for (const player of players) {
    for (const item of player.activity) {
      const month = parseActivityDate(item.date).getMonth()
      hoursByMonth.set(month, (hoursByMonth.get(month) ?? 0) + item.playedHours)
    }
  }

  return Array.from({ length: 12 }, (_, monthIndex) => ({
    label: capitalize(monthFormatter.format(new Date(2026, monthIndex, 1))),
    shortLabel: capitalize(
      monthFormatter.format(new Date(2026, monthIndex, 1)).slice(0, 3),
    ),
    hours: hoursByMonth.get(monthIndex) ?? 0,
  }))
}

function buildWeekdayStats(players: PublicPlayerProfile[]) {
  const hoursByWeekday = new Map<number, number>()

  for (const player of players) {
    for (const item of player.activity) {
      const weekday = parseActivityDate(item.date).getDay()
      hoursByWeekday.set(
        weekday,
        (hoursByWeekday.get(weekday) ?? 0) + item.playedHours,
      )
    }
  }

  return weekdayLabels.map((label, weekday) => ({
    label,
    shortLabel: label.slice(0, 2),
    hours: hoursByWeekday.get(weekday) ?? 0,
  }))
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function getTopActivityDay(activity: PlayerDailyActivity[]) {
  return activity.reduce<PlayerDailyActivity | null>((top, item) => {
    if (!top || item.playedHours > top.playedHours) {
      return item
    }

    return top
  }, null)
}

function ActivityBreakdownCard({
  description,
  items,
  title,
}: {
  description: string
  items: ActivityBreakdownItem[]
  title: string
}) {
  const maxHours = items.reduce(
    (currentMax, item) => Math.max(currentMax, item.hours),
    0,
  )

  return (
    <Card className="border border-[var(--separator)] bg-[var(--surface)]">
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <Card.Title>{title}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </div>
      </Card.Header>
      <Card.Content className="grid gap-3 p-5 pt-0">
        {items.map((item) => {
          const width = maxHours > 0 ? `${(item.hours / maxHours) * 100}%` : '0%'

          return (
            <div key={item.label} className="grid gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <Text type="body-sm" weight="medium">
                  {item.label}
                </Text>
                <Text className="whitespace-nowrap" color="muted" type="body-sm">
                  {formatPlayedHours(item.hours)}
                </Text>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]/80 transition-[width] duration-300"
                  style={{ width }}
                />
              </div>
            </div>
          )
        })}
      </Card.Content>
    </Card>
  )
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
    const monthHours = players.reduce(
      (sum, player) => sum + player.stats.monthHours,
      0,
    )
    const weekHours = players.reduce(
      (sum, player) => sum + player.stats.weekHours,
      0,
    )
    const todayHours = players.reduce(
      (sum, player) => sum + player.stats.todayHours,
      0,
    )
    const onlineCount = players.filter((player) => player.isOnline).length
    const leader = players.at(0) ?? null
    const mostActiveToday = players.reduce<PublicPlayerProfile | null>(
      (top, player) => {
        if (!top || player.stats.todayHours > top.stats.todayHours) {
          return player
        }

        return top
      },
      null,
    )

    return {
      leader,
      monthHours,
      mostActiveToday:
        mostActiveToday && mostActiveToday.stats.todayHours > 0
          ? mostActiveToday
          : null,
      onlineCount,
      todayHours,
      totalHours,
      weekHours,
    }
  }, [players])

  const monthStats = useMemo(() => buildMonthStats(players), [players])
  const weekdayStats = useMemo(() => buildWeekdayStats(players), [players])

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
                <div className="grid grid-cols-1 divide-y divide-[var(--separator)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
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
                      За месяц
                    </Text>
                    <Text className="mt-1 text-3xl font-semibold">
                      {formatPlayedHours(stats.monthHours)}
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
              <Card.Content className="grid gap-4">
                <div>
                  <Text className="text-muted">Лидер по игровому времени:</Text>
                  {stats.leader ? (
                    <div className="mt-3 flex items-center justify-between gap-5">
                      <div className="min-w-0">
                        <Card.Title>{stats.leader.nickname}</Card.Title>
                        <Text className="mt-1" color="muted" type="body-sm">
                          Пик активности:{' '}
                          {formatTopDay(stats.leader.activity)}
                        </Text>
                      </div>
                      <PlayerAvatar
                        size="lg"
                        nickname={stats.leader.nickname}
                      />
                    </div>
                  ) : (
                    <Text className="mt-3" color="muted" type="body-sm">
                      Пока нет данных по игрокам.
                    </Text>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-[var(--separator)] p-4">
                    <Text color="muted" type="body-sm">
                      За неделю
                    </Text>
                    <Text className="mt-1 text-2xl font-semibold">
                      {formatPlayedHours(stats.weekHours)}
                    </Text>
                  </div>
                  <div className="rounded-lg border border-[var(--separator)] p-4">
                    <Text color="muted" type="body-sm">
                      Сегодня
                    </Text>
                    <Text className="mt-1 text-2xl font-semibold">
                      {formatPlayedHours(stats.todayHours)}
                    </Text>
                    {stats.mostActiveToday ? (
                      <Text className="mt-1" color="muted" type="body-sm">
                        Активнее всех: {stats.mostActiveToday.nickname}
                      </Text>
                    ) : null}
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ActivityBreakdownCard
              title="По месяцам"
              description="Суммарная наигранность по календарным месяцам."
              items={monthStats}
            />
            <ActivityBreakdownCard
              title="По дням недели"
              description="Когда игроки чаще всего заходят на сервер."
              items={weekdayStats}
            />
          </div>

          <Card className="border border-[var(--separator)] bg-[var(--surface)]">
            <Card.Header className="flex items-start justify-between">
              <div>
                <Card.Title>Игроки</Card.Title>
                <Card.Description>
                  Рейтинг по игровому времени
                </Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="grid gap-3 p-5 pt-0 sm:grid-cols-2 xl:grid-cols-4">
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
                      Наиграл: <span>{formatPlayedHours(player.playedHours)}</span>
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

function formatTopDay(activity: PlayerDailyActivity[]) {
  const topDay = getTopActivityDay(activity)

  if (!topDay) {
    return 'нет данных'
  }

  return `${topDay.date} · ${formatPlayedHours(topDay.playedHours)}`
}
