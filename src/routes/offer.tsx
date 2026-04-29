import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/offer')({
  head: () => ({
    meta: [
      {
        title: 'Публичная оферта | XK HARDCORE',
      },
      {
        name: 'description',
        content:
          'Условия оплаты, получения цифровых услуг и контакты XK HARDCORE.',
      },
    ],
  }),
  component: OfferPage,
})

function OfferPage() {
  return (
    <main className="tycoon-landing xk-legal-page">
      <section className="page-wrap xk-legal-shell">
        <p className="xk-overline">Документы</p>
        <h1 className="mc-footer-title">Публичная оферта XK HARDCORE</h1>
        <p className="xk-legal-lead">
          Этот документ описывает условия оплаты цифровых услуг на сайте XK
          HARDCORE: проходки на приватный Minecraft сервер и дополнительной
          RP-жизни.
        </p>

        <div className="xk-legal-grid">
          <article className="xk-legal-card">
            <h2>Исполнитель</h2>
            <p>Самозанятый: Сурнин Владислав Владимирович.</p>
            <p>ИНН: 233711467280.</p>
            <p>
              Email:{' '}
              <a href="mailto:surnin.vladislav@gmail.com">
                surnin.vladislav@gmail.com
              </a>
              .
            </p>
            <p>
              Телефон: <a href="tel:+79186618809">+7 918 661-88-09</a>.
            </p>
            <p>Почтовый адрес: г. Анапа, ул. Ленина 180А.</p>
          </article>

          <article className="xk-legal-card">
            <h2>Товары и услуги</h2>
            <p>
              Проходка на XK HARDCORE: цифровая услуга по предоставлению доступа
              к приватному серверу и автоматическому добавлению указанного
              никнейма в whitelist после успешной оплаты. Цена: 200 руб.
            </p>
            <p>
              Дополнительная RP-жизнь: цифровая услуга по начислению одной
              дополнительной RP-жизни активному игроку текущего сезона после
              подтверждения администратором. Цена: 200 руб.
            </p>
          </article>

          <article className="xk-legal-card">
            <h2>Оплата и получение заказа</h2>
            <p>
              При оформлении заказа игрок указывает никнейм Minecraft и
              выбранную цифровую услугу. После успешной оплаты игрок пишет
              администратору в Telegram{' '}
              <a href="https://t.me/blackonechik">@blackonechik</a>, указывает
              ID заказа и никнейм для активации услуги.
            </p>
            <p>
              Физическая доставка не требуется: заказ предоставляется внутри
              игрового сервера после проверки платежа и сообщения игрока
              администратору.
            </p>
          </article>

          <article className="xk-legal-card">
            <h2>Условия использования</h2>
            <p>
              Игрок обязуется указывать достоверный никнейм и соблюдать правила
              сервера. Оплата не даёт права нарушать правила XK HARDCORE или
              получать игровые преимущества, не указанные в описании услуги.
            </p>
            <p>
              Если услугу невозможно предоставить по технической причине или
              из-за ошибки в заказе, вопрос решается через Telegram
              администратора, контактный email или телефон.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
