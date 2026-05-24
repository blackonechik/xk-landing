import { useEffect, useState } from 'react'

const DAY_START_HOUR = 6
const NIGHT_START_HOUR = 18

export function getHeroVideoSource() {
  return '/assets/video/hero_video.mp4'
}

function isWinterDate(date: Date) {
  const month = date.getMonth()

  return month === 11 || month === 0 || month === 1
}

function isDayTime(date: Date) {
  const hours = date.getHours()

  return hours >= DAY_START_HOUR && hours < NIGHT_START_HOUR
}

function getNextDayBoundary(date: Date) {
  const next = new Date(date)
  const hours = date.getHours()

  if (hours < DAY_START_HOUR) {
    next.setHours(DAY_START_HOUR, 0, 0, 0)
    return next
  }

  if (hours < NIGHT_START_HOUR) {
    next.setHours(NIGHT_START_HOUR, 0, 0, 0)
    return next
  }

  next.setDate(next.getDate() + 1)
  next.setHours(DAY_START_HOUR, 0, 0, 0)
  return next
}

function getNextSeasonBoundary(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()

  if (month === 11 || month === 0 || month === 1) {
    return new Date(year, 2, 1, 0, 0, 0, 0)
  }

  return new Date(month < 11 ? year : year + 1, 11, 1, 0, 0, 0, 0)
}

function getNextTransitionDelay(date: Date) {
  const nextDayBoundary = getNextDayBoundary(date).getTime()
  const nextSeasonBoundary = getNextSeasonBoundary(date).getTime()
  const nextTransition = Math.min(nextDayBoundary, nextSeasonBoundary)

  return Math.max(60_000, nextTransition - date.getTime() + 1_000)
}

export function getLifeVideoSource(date: Date) {
  const isWinter = isWinterDate(date)
  const isDay = isDayTime(date)

  if (isWinter && isDay) {
    return '/assets/video/help_snow_day.mp4'
  }

  if (isWinter && !isDay) {
    return '/assets/video/help_snow_night.mp4'
  }

  if (isDay) {
    return '/assets/video/help_day.mp4'
  }

  return '/assets/video/help_night.mp4'
}

export function useLifeVideoSource() {
  const [videoSource, setVideoSource] = useState(() =>
    getLifeVideoSource(new Date()),
  )

  useEffect(() => {
    let timeoutId: ReturnType<typeof window.setTimeout> | null = null

    const scheduleNextUpdate = () => {
      const now = new Date()
      setVideoSource(getLifeVideoSource(now))

      timeoutId = window.setTimeout(() => {
        scheduleNextUpdate()
      }, getNextTransitionDelay(now))
    }

    scheduleNextUpdate()

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  return videoSource
}
