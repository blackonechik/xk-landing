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
        <p className="mc-footer-copy">ИНН 233711467280</p>
        <p className="mc-footer-copy">&copy; {year} XK HARDCORE. Все права защищены.</p>
      </div>
    </footer>
  )
}
