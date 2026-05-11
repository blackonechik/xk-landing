import { useEffect, useRef, useState } from 'react'

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
    <header className={['xk-site-header', isHidden ? 'is-hidden' : ''].filter(Boolean).join(' ')}>
      <div className="page-wrap xk-site-header__inner">
        <a className="xk-site-header__brand" href="/">
          XK HARDCORE
        </a>
        <nav className="xk-site-header__nav" aria-label="Основная навигация">
          <a href="/payment">Оплата</a>
          <a href="/rules">Правила</a>
        </nav>
      </div>
    </header>
  )
}
