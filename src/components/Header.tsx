import { useEffect, useRef, useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Avatar, Button, Card, Link } from '@heroui/react'
import { LogOut } from 'lucide-react'
import AnimatedLink from './AnimatedLink'
import { fetchAccount, logout, type AccountPayload } from '@/entities/account'
import { LandingButton } from '@/shared/ui/landing-button'
import { HeroLinkButton } from '@/shared/ui/hero-page'

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
  const isMinecraftHeader = pathname === '/' || pathname.startsWith('/payment')

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

  useEffect(() => {
    let isActive = true

    async function loadAccount() {
      try {
        const payload = await fetchAccount()

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

  async function handleLogout() {
    await logout()
    setAccount(null)
    setAuthState('guest')
    await navigate({ to: '/' })
  }

  const avatarStyle = account
    ? {
        backgroundImage: `url(https://api.mcheads.org/head/${encodeURIComponent(
          account.player.nickname,
        )}/64)`,
      }
    : undefined
  const avatarUrl = account
    ? `https://api.mcheads.org/head/${encodeURIComponent(
        account.player.nickname,
      )}/64`
    : undefined

  if (!isMinecraftHeader) {
    return (
      <header className="fixed inset-x-0 top-0 z-80 px-4 pt-4 font-[Montserrat,sans-serif] sm:px-6 lg:px-8">
        <Card
          className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-4 px-4 py-3"
          variant="secondary"
        >
          <AnimatedLink className="font-semibold text-foreground" to="/">
            XK HARDCORE
          </AnimatedLink>

          <nav
            className="flex flex-wrap items-center justify-end gap-2"
            aria-label="Основная навигация"
          >
            <Link href="/rules">Правила</Link>
            <Link href="/offer">Оферта</Link>
            {authState === 'authed' ? (
              <>
                <Link href="/cabinet">Кабинет</Link>
                <Link href="/cabinet/bank">Банк</Link>
                <Button
                  size="sm"
                  variant="secondary"
                  onPress={() => void handleLogout()}
                >
                  <Avatar className="size-6">
                    {avatarUrl ? <Avatar.Image alt="" src={avatarUrl} /> : null}
                    <Avatar.Fallback>
                      {account?.player.nickname.slice(0, 2).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  Выйти
                  <LogOut size={16} aria-hidden="true" />
                </Button>
              </>
            ) : authState === 'guest' ? (
              <HeroLinkButton to="/login" size="sm">
                Войти
              </HeroLinkButton>
            ) : null}
          </nav>
        </Card>
      </header>
    )
  }

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
          {authState === 'authed' ? (
            <div className="xk-site-header__auth">
              <AnimatedLink className="xk-site-header__nav-link" to="/cabinet">
                Кабинет
              </AnimatedLink>
              <AnimatedLink
                className="xk-site-header__nav-link"
                to="/cabinet/bank"
              >
                Банк
              </AnimatedLink>
              <button
                className="xk-site-header__auth-button"
                type="button"
                onClick={() => void handleLogout()}
                aria-label="Выйти"
                title="Выйти"
              >
                <span
                  className="xk-site-header__auth-avatar"
                  style={avatarStyle}
                  aria-hidden="true"
                />
                <span className="xk-site-header__auth-label">Выйти</span>
                <LogOut size={16} aria-hidden="true" />
              </button>
            </div>
          ) : authState === 'guest' ? (
            <LandingButton href="/login" tone="success" size="small">
              Войти
            </LandingButton>
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
