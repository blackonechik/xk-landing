import { Card, Text } from '@heroui/react'
import { formatPlayedHours } from '@/entities/player'
import type { PublicPlayerProfile } from '@/entities/player'

type ProfileActivityPanelProps = {
  player: PublicPlayerProfile
}

const dayFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function getHeatmapDates() {
  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - 364)

  const dates: Date[] = []
  const cursor = new Date(start)

  while (cursor <= end) {
    dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

function getCellClassName(hours: number) {
  if (hours <= 0) {
    return 'bg-surface-secondary'
  }

  if (hours < 1) {
    return 'bg-emerald-500/25'
  }

  if (hours < 3) {
    return 'bg-emerald-500/45'
  }

  if (hours < 6) {
    return 'bg-emerald-400/70'
  }

  return 'bg-emerald-300'
}

export function ProfileActivityPanel({ player }: ProfileActivityPanelProps) {
  const activityByDate = new Map(
    player.activity.map((item) => [item.date, item.playedHours]),
  )
  const dates = getHeatmapDates()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Статистика</Card.Title>
        <Card.Description>
          Игровая активность по календарным дням за последний год.
        </Card.Description>
      </Card.Header>
      <Card.Content className="grid gap-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-[var(--separator)] p-4">
            <Text color="muted" type="body-sm">Наиграл</Text>
            <Text type="h4">{formatPlayedHours(player.stats.totalHours)}</Text>
          </div>
          <div className="rounded-lg border border-[var(--separator)] p-4">
            <Text color="muted" type="body-sm">Месяц</Text>
            <Text type="h4">{formatPlayedHours(player.stats.monthHours)}</Text>
          </div>
          <div className="rounded-lg border border-[var(--separator)] p-4">
            <Text color="muted" type="body-sm">Неделя</Text>
            <Text type="h4">{formatPlayedHours(player.stats.weekHours)}</Text>
          </div>
          <div className="rounded-lg border border-[var(--separator)] p-4">
            <Text color="muted" type="body-sm">Сегодня</Text>
            <Text type="h4">{formatPlayedHours(player.stats.todayHours)}</Text>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="grid w-full grid-flow-col grid-rows-7 gap-1">
            {dates.map((date) => {
              const key = getDateKey(date)
              const hours = activityByDate.get(key) ?? 0

              return (
                <span
                  key={key}
                  className={[
                    'size-4 rounded-[3px] border border-separator/60',
                    getCellClassName(hours),
                  ].join(' ')}
                  title={`${dayFormatter.format(date)}: ${formatPlayedHours(hours)}`}
                />
              )
            })}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}
