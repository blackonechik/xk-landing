import { Card, Text, Tooltip } from '@heroui/react'
import { formatPlayedHours } from '@/entities/player'
import type { PublicPlayerProfile } from '@/entities/player'

type ProfileActivityPanelProps = {
  player: PublicPlayerProfile
}

type HeatmapCell = {
  date: Date
  key: string
}

type HeatmapWeek = {
  days: HeatmapCell[]
  monthLabel: string | null
}

const dayFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const monthLabelFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'short',
})

const weekdayLabels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const

function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function buildHeatmapWeeks() {
  const today = startOfDay(new Date())
  const firstVisibleDay = new Date(today)
  firstVisibleDay.setDate(today.getDate() - 364)
  firstVisibleDay.setDate(firstVisibleDay.getDate() - firstVisibleDay.getDay())

  const lastVisibleDay = new Date(today)
  lastVisibleDay.setDate(lastVisibleDay.getDate() + (6 - lastVisibleDay.getDay()))

  const dates: HeatmapCell[] = []
  const cursor = new Date(firstVisibleDay)

  while (cursor <= lastVisibleDay) {
    dates.push({
      date: new Date(cursor),
      key: getDateKey(cursor),
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  const weeks: HeatmapWeek[] = []
  let previousMonth: number | null = null

  for (let index = 0; index < dates.length; index += 7) {
    const days = dates.slice(index, index + 7)
    const firstMonthDay = days.find((item) => item.date.getDate() === 1)
    const monthIndex = firstMonthDay?.date.getMonth() ?? null

    weeks.push({
      days,
      monthLabel:
        monthIndex !== null && monthIndex !== previousMonth
          ? capitalizeMonth(monthLabelFormatter.format(firstMonthDay.date))
          : null,
    })

    if (monthIndex !== null) {
      previousMonth = monthIndex
    }
  }

  return weeks
}

function capitalizeMonth(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replace('.', '')
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
  const weeks = buildHeatmapWeeks()

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
            <Text color="muted" type="body-sm">
              Наиграл
            </Text>
            <Text type="h4">{formatPlayedHours(player.stats.totalHours)}</Text>
          </div>
          <div className="rounded-lg border border-[var(--separator)] p-4">
            <Text color="muted" type="body-sm">
              Месяц
            </Text>
            <Text type="h4">{formatPlayedHours(player.stats.monthHours)}</Text>
          </div>
          <div className="rounded-lg border border-[var(--separator)] p-4">
            <Text color="muted" type="body-sm">
              Неделя
            </Text>
            <Text type="h4">{formatPlayedHours(player.stats.weekHours)}</Text>
          </div>
          <div className="rounded-lg border border-[var(--separator)] p-4">
            <Text color="muted" type="body-sm">
              Сегодня
            </Text>
            <Text type="h4">{formatPlayedHours(player.stats.todayHours)}</Text>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div
            className="grid min-w-max gap-x-2 gap-y-1"
            style={{
              gridTemplateColumns: `28px repeat(${weeks.length}, minmax(0, 12px))`,
              gridTemplateRows: '18px repeat(7, 12px)',
            }}
          >
            <div aria-hidden="true" />
            {weeks.map((week, index) => (
              <div
                key={`month-${week.days[0]?.key ?? index}`}
                className="text-[11px] leading-none text-muted-foreground"
                style={{ gridColumn: index + 2, gridRow: 1 }}
              >
                {week.monthLabel}
              </div>
            ))}

            {weekdayLabels.map((label, rowIndex) => (
              <div
                key={label}
                className="text-[11px] leading-none text-muted-foreground"
                style={{ gridColumn: 1, gridRow: rowIndex + 2 }}
              >
                {rowIndex % 2 === 1 ? label : ''}
              </div>
            ))}

            {weeks.map((week, columnIndex) =>
              week.days.map((day, rowIndex) => {
                const hours = activityByDate.get(day.key) ?? 0
                const formattedDate = dayFormatter.format(day.date)
                const formattedHours = formatPlayedHours(hours)

                return (
                  <Tooltip
                    key={day.key}
                    content={
                      <div className="grid gap-0.5 text-center">
                        <span>{formattedDate}</span>
                        <span className="text-muted">{formattedHours}</span>
                      </div>
                    }
                    delay={100}
                    placement="top"
                    showArrow
                  >
                    <span
                      aria-label={`${formattedDate}: ${formattedHours}`}
                      className={[
                        'block size-3 rounded-[3px] border border-separator/60',
                        getCellClassName(hours),
                      ].join(' ')}
                      style={{
                        gridColumn: columnIndex + 2,
                        gridRow: rowIndex + 2,
                      }}
                      tabIndex={0}
                    />
                  </Tooltip>
                )
              }),
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}
