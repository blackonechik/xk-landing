import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Avatar, Button } from '@heroui/react'
import { LogOut } from 'lucide-react'
import AnimatedLink from './AnimatedLink'
import { fetchAccount, logout, type AccountPayload } from '@/entities/account'

export default function Header() {
  const [isHidden, setIsHidden] = useState(false)
  const [account, setAccount] = useState<AccountPayload | null>(null)
  const [authState, setAuthState] = useState<'loading' | 'guest' | 'authed'>(
    'loading',
  )
  const lastScrollY = useRef(0)
  const navigate = useNavigate()

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

  const avatarUrl = account
    ? `https://api.mcheads.org/head/${encodeURIComponent(
        account.player.nickname,
      )}/64`
    : undefined

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
          <AnimatedLink className="xk-site-header__nav-link" to="/offer">
            Оферта
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
                <Avatar className="xk-site-header__auth-avatar">
                  {avatarUrl ? <Avatar.Image alt="" src={avatarUrl} /> : null}
                  <Avatar.Fallback>
                    {account?.player.nickname.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <span className="xk-site-header__auth-label">Выйти</span>
                <LogOut size={16} aria-hidden="true" />
              </button>
            </div>
          ) : authState === 'guest' ? (
            <Button
              className="xk-site-header__login-button"
              render={(props) => <AnimatedLink {...props} to="/login" />}
              size="sm"
            >
              Войти
            </Button>
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
