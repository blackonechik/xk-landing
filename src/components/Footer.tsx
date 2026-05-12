import { useRouterState } from '@tanstack/react-router'
import AnimatedLink from './AnimatedLink'

export default function Footer() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  if (pathname.startsWith('/cabinet')) {
    return null
  }

  const year = new Date().getFullYear()

  return (
    <footer className="mc-footer">
      <div className="page-wrap mc-footer-inner">
        <div className="mc-footer-main">
          <div className="mc-footer-about">
            <p className="mc-footer-title">XK HARDCORE</p>
            <p className="mc-footer-text">
              Приватный Minecraft сервер без приватов и донатов. Ваниль, RP,
              королевства и история, которую создают игроки.
            </p>
          </div>
          <nav className="mc-footer-links" aria-label="Документы и оплата">
            <AnimatedLink to="/payment">Оплата</AnimatedLink>
            <AnimatedLink to="/rules">Правила</AnimatedLink>
            <AnimatedLink to="/offer">Оферта</AnimatedLink>
            <AnimatedLink to="/privacy">Политика конфиденциальности</AnimatedLink>
            <AnimatedLink to="/personal-data-consent">
              Согласие на обработку ПДн
            </AnimatedLink>
          </nav>
        </div>
        <p className="mc-footer-copy">
          &copy; {year} XK HARDCORE. Все права защищены.
        </p>
      </div>
    </footer>
  )
}
