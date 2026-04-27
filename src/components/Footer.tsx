export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mc-footer">
      <div className="page-wrap mc-footer-inner">
        <p className="mc-footer-title">XK HARDCORE</p>
        <p className="mc-footer-text">
          Приватный Minecraft сервер без приватов и донатов. Ваниль, RP,
          королевства и история, которую создают игроки.
        </p>
        <nav className="mc-footer-links" aria-label="Документы и оплата">
          <a href="/payment">Оплата</a>
          <a href="/offer">Оферта</a>
          <a href="mailto:surnin.vladislav@gmail.com">surnin.vladislav@gmail.com</a>
        </nav>
        <p className="mc-footer-copy">&copy; {year} XK HARDCORE. Все права защищены.</p>
      </div>
    </footer>
  )
}
