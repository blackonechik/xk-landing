import { useEffect, useRef, useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { buttonVariants } from '@heroui/react'
import { LogOut } from 'lucide-react'
import AnimatedLink from './AnimatedLink'
import {
  PlayerAvatar,
  fetchAccountCached,
  logout,
} from '@/entities/account'
import type { AccountPayload } from '@/entities/account'

export default function Header() {
  const [isHidden, setIsHidden] = useState(false)
  const [account, setAccount] = useState<AccountPayload | null>(null)
  const [authState, setAuthState] = useState<'loading' | 'guest' | 'authed'>(
    'loading',
  )
  const lastScrollY = useRef(0)
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isCabinetRoute = pathname.startsWith('/cabinet')

  useEffect(() => {
    if (isCabinetRoute) {
      setIsHidden(false)
      return undefined
    }

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
  }, [isCabinetRoute])

  useEffect(() => {
    let isActive = true

    async function loadAccount() {
      try {
        const payload = await fetchAccountCached()

        if (!isActive) {
          return
        }

        setAccount(payload)
        setAuthState('authed')
      } catch {
        if (!isActive) {
          return
        }

        setAccount(null)
        setAuthState('guest')
      }
    }

    void loadAccount()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <header
      className={[
        'xk-site-header',
        isHidden ? 'is-hidden' : '',
        isCabinetRoute ? 'is-locked' : '',
      ]
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
          <AnimatedLink className="xk-site-header__nav-link" to="/offer">
            Оферта
          </AnimatedLink>
          {authState === 'authed' ? (
            <div className="xk-site-header__auth">
              <button
                className="xk-site-header__auth-button"
                type="button"
                onClick={() => navigate({ to: '/cabinet' })}
                aria-label="Личный кабинет"
                title="Личный кабинет"
              >
                {account ? (
                  <PlayerAvatar
                    className="xk-site-header__auth-avatar"
                    nickname={account.player.nickname}
                  />
                ) : null}
                <span className="xk-site-header__auth-label">Личный кабинет</span>
              </button>
            </div>
          ) : authState === 'guest' ? (
            <AnimatedLink
              className={buttonVariants({
                className: 'xk-site-header__login-button',
                size: 'sm',
              })}
              to="/login"
            >
              Войти
            </AnimatedLink>
          ) : (
            <span
              className="xk-site-header__auth-placeholder"
              aria-hidden="true"
            />
          )}
        </nav>
      </div>
    </header>
  )
}
