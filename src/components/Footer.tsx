export default function Footer() {
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
            <a href="/payment">Оплата</a>
            <a href="/rules">Правила</a>
            <a href="/offer">Оферта</a>
            <a href="/privacy">Политика конфиденциальности</a>
            <a href="/personal-data-consent">Согласие на обработку ПДн</a>
          </nav>
        </div>
        <p className="mc-footer-copy">
          &copy; {year} XK HARDCORE. Все права защищены.
        </p>
      </div>
    </footer>
  )
}
