import { useEffect, useState } from 'react'

const MIN_VISIBLE_MS = 2200
const MAX_VISIBLE_MS = 4200

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const startedAt = window.performance.now()
    let isHiding = false
    let hideTimer: number | undefined
    let removeTimer: number | undefined

    const hideWhenReady = () => {
      if (isHiding) {
        return
      }

      isHiding = true
      const elapsed = window.performance.now() - startedAt
      const delay = Math.max(MIN_VISIBLE_MS - elapsed, 0)

      hideTimer = window.setTimeout(() => {
        setIsLeaving(true)
        removeTimer = window.setTimeout(() => {
          setIsVisible(false)
          document.body.classList.remove('xk-loading-active')
        }, 560)
      }, delay)
    }

    document.body.classList.add('xk-loading-active')

    if (document.readyState === 'complete') {
      hideWhenReady()
    } else {
      window.addEventListener('load', hideWhenReady, { once: true })
    }

    const fallbackTimer = window.setTimeout(hideWhenReady, MAX_VISIBLE_MS)

    return () => {
      window.removeEventListener('load', hideWhenReady)
      window.clearTimeout(fallbackTimer)
      window.clearTimeout(hideTimer)
      window.clearTimeout(removeTimer)
      document.body.classList.remove('xk-loading-active')
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={isLeaving ? 'xk-loader xk-loader_is-leaving' : 'xk-loader'}
      role="status"
      aria-live="polite"
      aria-label="Загрузка XK SMP"
    >
      <div className="xk-loader__sky" aria-hidden="true" />
      <div className="xk-loader__stars" aria-hidden="true" />
      <div className="xk-loader__scene" aria-hidden="true">
        <span className="xk-loader__block xk-loader__block_grass" />
        <span className="xk-loader__block xk-loader__block_stone" />
        <span className="xk-loader__block xk-loader__block_ore" />
        <span className="xk-loader__block xk-loader__block_wood" />
      </div>
      <div className="xk-loader__content">
        <p className="xk-loader__eyebrow">Загрузка мира</p>
        <div className="xk-loader__logo" aria-hidden="true">
          <span>XK</span>
          <strong>SMP</strong>
        </div>
        <p className="xk-loader__subtitle">Генерируем чанки и собираем историю</p>
        <div className="xk-loader__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}
