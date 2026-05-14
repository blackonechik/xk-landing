export function formatDate(value: string | null) {
  if (!value) {
    return 'нет данных'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatLastSeen(value: string | null, now = new Date()) {
  if (!value) {
    return 'нет данных'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'нет данных'
  }

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60_000))
  const diffHours = Math.floor(diffMinutes / 60)

  if (isSameDay(date, now)) {
    if (diffMinutes < 1) {
      return 'только что'
    }

    if (diffHours < 6) {
      if (diffMinutes < 60) {
        return `${diffMinutes} ${getPlural(diffMinutes, [
          'минуту',
          'минуты',
          'минут',
        ])} назад`
      }

      return `${diffHours} ${getPlural(diffHours, [
        'час',
        'часа',
        'часов',
      ])} назад`
    }

    return `Сегодня, ${formatTime(date)}`
  }

  if (isYesterday(date, now)) {
    return `Вчера, ${formatTime(date)}`
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function isYesterday(value: Date, now: Date) {
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  return isSameDay(value, yesterday)
}

function getPlural(value: number, forms: [string, string, string]) {
  const absolute = Math.abs(value)
  const lastTwoDigits = absolute % 100
  const lastDigit = absolute % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2]
  }

  if (lastDigit === 1) {
    return forms[0]
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1]
  }

  return forms[2]
}
