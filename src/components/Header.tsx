import { useEffect, useRef, useState } from 'react'
import AnimatedLink from './AnimatedLink'
import { LandingButton } from '@/shared/ui/landing-button'

export default function Header() {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    lastScrollY.current = window.scrollY

    function handleScroll() {
      const nextScrollY = window.scrollY
      const isScrollingDown = nextScrollY > lastScrollY.current

      setIsHidden(isScrollingDown && nextScrollY > 90)
      lastScrollY.current = nextScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={['xk-site-header', isHidden ? 'is-hidden' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className="page-wrap xk-site-header__inner">
        <AnimatedLink className="xk-site-header__brand" to="/">
          XK HARDCORE
        </AnimatedLink>
        <nav className="xk-site-header__nav" aria-label="Основная навигация">
          <AnimatedLink className="xk-site-header__nav-link" to="/payment">
            Оплата
          </AnimatedLink>
          <AnimatedLink className="xk-site-header__nav-link" to="/rules">
            Правила
          </AnimatedLink>
          <LandingButton
            href="/login"
            tone="success"
            size="small"
          >
            Войти
          </LandingButton>
        </nav>
      </div>
    </header>
  )
}
