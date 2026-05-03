import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personal-data-consent')({
  head: () => ({
    meta: [
      {
        title: 'Согласие на обработку персональных данных | XK HARDCORE',
      },
      {
        name: 'description',
        content:
          'Согласие пользователя XK HARDCORE на обработку персональных данных.',
      },
    ],
  }),
  component: PersonalDataConsentPage,
})

function PersonalDataConsentPage() {
  return (
    <main className="tycoon-landing xk-legal-page">
      <section className="page-wrap xk-legal-shell">
        <p className="xk-overline">Документы</p>
        <h1 className="mc-footer-title">
          Согласие на обработку персональных данных
        </h1>
        <p className="xk-legal-lead">
          Заполняя форму оплаты на сайте XK HARDCORE и отмечая согласие,
          пользователь свободно, своей волей и в своем интересе дает согласие
          оператору на обработку персональных данных.
        </p>

        <div className="xk-legal-grid">
          <article className="xk-legal-card">
            <h2>Кому дается согласие</h2>
            <p>Оператор: самозанятый Сурнин Владислав Владимирович.</p>
            <p>ИНН: 233711467280.</p>
            <p>
              Email:{' '}
              <a href="mailto:surnin.vladislav@gmail.com">
                surnin.vladislav@gmail.com
              </a>
              .
            </p>
            <p>
              Telegram:{' '}
              <a href="https://t.me/blackonechik">@blackonechik</a>.
            </p>
            <p>Почтовый адрес: г. Анапа, ул. Ленина 180А.</p>
          </article>

          <article className="xk-legal-card">
            <h2>Какие данные</h2>
            <p>
              Пользователь соглашается на обработку никнейма Minecraft,
              выбранной цифровой услуги, промокода, статуса заказа и платежа, а
              также технических данных, связанных с оформлением заказа.
            </p>
          </article>

          <article className="xk-legal-card">
            <h2>Для каких целей</h2>
            <p>
              Цели обработки: оформление заказа, прием оплаты, активация
              проходки или RP-жизни, поддержка, ведение учета и исполнение
              требований законодательства РФ.
            </p>
          </article>

          <article className="xk-legal-card">
            <h2>Какие действия разрешены</h2>
            <p>
              Пользователь разрешает сбор, запись, систематизацию, накопление,
              хранение, уточнение, использование, передачу платежному
              провайдеру, блокирование, удаление и уничтожение персональных
              данных.
            </p>
            <p>
              Обработка может выполняться как автоматизированным, так и
              неавтоматизированным способом.
            </p>
          </article>

          <article className="xk-legal-card">
            <h2>Срок действия</h2>
            <p>
              Согласие действует до достижения целей обработки или до его отзыва
              пользователем, если более длительное хранение не требуется по
              закону.
            </p>
          </article>

          <article className="xk-legal-card">
            <h2>Как отозвать</h2>
            <p>
              Согласие можно отозвать письменным обращением на{' '}
              <a href="mailto:surnin.vladislav@gmail.com">
                surnin.vladislav@gmail.com
              </a>
              {' '}или в Telegram{' '}
              <a href="https://t.me/blackonechik">@blackonechik</a>
              . После получения отзыва оператор прекратит обработку данных,
              кроме случаев, когда дальнейшая обработка разрешена законом.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
