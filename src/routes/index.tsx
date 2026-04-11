import { createFileRoute } from '@tanstack/react-router'

const reasons = [
  {
    title: 'Выделенная машина',
    text: 'Сервер находится не на псевдо-хостингах, а на полноценной выделенной машине.',
    tone: 'green',
  },
  {
    title: 'Стабильность TPS',
    text: 'Нормальная техническая база, чтобы мир жил долго и не превращался в борьбу с лагами.',
    tone: 'gold',
  },
  {
    title: 'RP жизни',
    text: 'Каждое решение имеет вес, а история мира складывается из ваших поступков и конфликтов.',
    tone: 'violet',
  },
]

const features = [
  {
    title: 'Города и королевства',
    text: 'Строй государства, вступай в союзы, веди дипломатию или запускай войны, которые меняют карту мира.',
  },
  {
    title: 'Dream SMP вайб',
    text: 'Сервер вдохновлён форматом сюжетного SMP, где самое важное создают сами игроки.',
  },
  {
    title: 'Без приватов и донатов',
    text: 'Никакого pay-to-win. Только ванильный мир, договорённости игроков и реальная репутация.',
  },
  {
    title: 'Защита аккаунта',
    text: 'Есть возможность привязать аккаунт к VK или Discord, чтобы чувствовать себя спокойнее.',
  },
]

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'XK SMP | Private Minecraft RolePlay Server',
      },
      {
        name: 'description',
        content:
          'XK SMP — приватный Minecraft RolePlay сервер в духе Dream SMP: ваниль, RP-жизни, города, королевства и долгий мир без донатов и приватов.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <main className="tycoon-landing xk-adapted">
      <a
        href="#header"
        className="tycoon-landing-btn index-fixed _left"
        style={{ opacity: 1 }}
      >
        <div className="tycoon-landing-btn__content px-35">
          <img
            src="https://landing.streamcraft.net/tycoon/img/general/btn-default-arrow-up.svg"
            alt=""
          />
        </div>
      </a>

      <a
        href="#apply"
        className="tycoon-landing-btn tycoon-landing-btn_style-success index-fixed _right"
        style={{ opacity: 1 }}
      >
        <div className="tycoon-landing-btn__content text-40">
          Играть
          <img
            src="https://landing.streamcraft.net/tycoon/img/general/btn-success-arrow-right.svg"
            className="tycoon-landing-btn__content-arrow ml-1"
            alt=""
          />
        </div>
      </a>

      <section id="header" className="tycoon-landing-header xk-header-hero">
        <img
          src="https://landing.streamcraft.net/tycoon/img/landing-12-2025/header-background.webp"
          className="tycoon-landing-header__background"
          alt=""
        />

        <img
          src="https://landing.streamcraft.net/tycoon/img/landing-12-2025/header-hero.webp"
          className="tycoon-landing-header__hero"
          alt=""
        />

        <div className="tycoon-landing-header__container px-150">
          <div className="row justify-content-start">
            <div className="col-12 col-md-9 col-lg-6">
              <div className="tycoon-landing-header__logo xk-header-logo">
                <div className="tycoon-landing-header__logo-effect">
                  <img
                    src="https://landing.streamcraft.net/tycoon/img/landing-12-2025/header-wide-rays.svg"
                    className="tycoon-landing-header__logo-effect-1"
                    alt=""
                  />
                </div>
                <div className="tycoon-landing-header__logo-effect">
                  <img
                    src="https://landing.streamcraft.net/tycoon/img/landing-12-2025/header-thin-rays.svg"
                    className="tycoon-landing-header__logo-effect-2"
                    alt=""
                  />
                </div>
                <div className="tycoon-landing-header__logo-effect">
                  <img
                    src="https://landing.streamcraft.net/tycoon/img/landing-12-2025/header-thin-rays-2.svg"
                    className="tycoon-landing-header__logo-effect-3"
                    alt=""
                  />
                </div>
                <div className="xk-header-logo__text">
                  <span className="xk-header-logo__caption">Private Minecraft Server</span>
                  <strong>XK SMP</strong>
                  <small>RolePlay • Vanilla • Dream SMP Spirit</small>
                </div>
              </div>

              <div className="tycoon-landing-header__container-content">
                <p className="xk-header-copy">
                  Сервер, который не является однодневкой и не закроется из-за
                  неуплаты хостинга. Ванильный мир без приватов и донатов, где
                  всё решают игроки, города и политика.
                </p>
                <a href="#apply" className="tycoon-landing-btn tycoon-landing-btn_style-success">
                  <div className="tycoon-landing-header__play-bright" />
                  <div className="tycoon-landing-btn__content text-40">
                    Подать заявку
                    <img
                      src="https://landing.streamcraft.net/tycoon/img/general/btn-success-arrow-right.svg"
                      className="tycoon-landing-btn__content-arrow ml-1"
                      alt=""
                    />
                  </div>
                </a>
              </div>
            </div>

            <div className="col-12 d-block d-md-none">
              <img
                src="https://landing.streamcraft.net/tycoon/img/landing-12-2025/header-hero.webp"
                className="tycoon-landing-header__hero-mobile"
                alt=""
              />
            </div>
          </div>
        </div>

        <img
          src="https://landing.streamcraft.net/tycoon/img/landing-12-2025/header-frontline.webp"
          className="tycoon-landing-header__frontline"
          alt=""
        />

        <a href="#start" className="tycoon-landing-header__arrow">
          <img
            src="https://landing.streamcraft.net/tycoon/img/general/header-arrow-down.svg"
            className="tycoon-landing-header__arrow-icon"
            alt=""
          />
        </a>
      </section>

      <section
        id="start"
        className="tycoon-landing-section tycoon-landing-section_style-gradient-1 overflow-hidden"
      >
        <div className="tycoon-landing-section__background" />
        <div className="tycoon-landing-section__background _righted" />
        <div className="tycoon-landing-section__line" />

        <div className="tycoon-landing-wrapper pt-150 pb-50">
          <div className="tycoon-landing-section__header">
            <div className="tycoon-landing-section__header-icon">
              <img
                src="https://landing.streamcraft.net/tycoon/img/general/section-gradient-1-heading-icon.svg"
                alt=""
              />
            </div>
            <h2 className="tycoon-landing-section__header-text mt-35">
              Начни играть
              <br />
              <span className="tycoon-landing-section__header-mark tycoon-color-gradient-purple">
                Прямо сейчас!
              </span>
            </h2>

            <div className="mt-25">
              <a href="#apply" className="tycoon-landing-btn tycoon-landing-btn_style-success">
                <div className="tycoon-landing-btn__content text-40">
                  Подать заявку
                  <img
                    src="https://landing.streamcraft.net/tycoon/img/general/btn-success-arrow-right.svg"
                    className="tycoon-landing-btn__content-arrow ml-1"
                    alt=""
                  />
                </div>
              </a>

              <div className="index-start__other mt-30">
                <div className="row align-items-center justify-content-center">
                  <div className="index-start__separator m-0" />
                  <span className="index-start__subheading mx-3">Почему заходят к нам:</span>
                  <div className="index-start__separator m-0" />
                </div>

                <div className="text-center mt-15 xk-start-tags">
                  <span className="tycoon-landing-btn index-start__launcher-btn mx-1 mx-md-2 mx-md-3 mx-lg-4">
                    <span className="tycoon-landing-btn__content px-35">Vanilla</span>
                  </span>
                  <span className="tycoon-landing-btn tycoon-landing-btn_style-primary index-start__launcher-btn mx-1 mx-md-2 mx-md-3 mx-lg-4">
                    <span className="tycoon-landing-btn__content px-35">RolePlay</span>
                  </span>
                  <span className="tycoon-landing-btn index-start__launcher-btn mx-1 mx-md-2 mx-md-3 mx-lg-4">
                    <span className="tycoon-landing-btn__content px-35">No Donate</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="index-start__preview px-150">
          <div className="xk-launcher-frame">
            <img
              src="https://landing.streamcraft.net/tycoon/img/general/launcher-preview.webp"
              className="index-start__preview-img"
              alt=""
            />
          </div>
          <img
            src="https://landing.streamcraft.net/tycoon/img/general/launcher-preview-effect.svg"
            className="index-start__preview-effect"
            alt=""
          />
        </div>
      </section>

      <section id="reasons" className="tycoon-landing-section tycoon-landing-section_style-green">
        <div className="tycoon-landing-section__background" />
        <div className="tycoon-landing-section__background _righted" />
        <div className="tycoon-landing-section__line" />
        <div className="tycoon-landing-section__effect" />

        <div className="tycoon-landing-wrapper py-150">
          <div className="tycoon-landing-section__header">
            <div className="tycoon-landing-section__header-icon _absolution">
              <img
                src="https://landing.streamcraft.net/tycoon/img/general/section-green-heading-icon.svg"
                alt=""
              />
            </div>
            <h2 className="tycoon-landing-section__header-text tycoon-color-lime mt-35">
              Почему мы
              <br />
              <span className="tycoon-landing-section__header-mark tycoon-color-yellowgreen">
                И почему здесь хочется остаться
              </span>
            </h2>
          </div>

          <div className="xk-card-grid mt-50">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className={`tycoon-landing-feature position-relative xk-info-card _${reason.tone}`}
              >
                <div className={`tycoon-landing-card tycoon-landing-card_style-${mapTone(reason.tone)}`}>
                  <div className="tycoon-landing-card__wrapper">
                    <div className="tycoon-landing-card__wrapper-inner">
                      <div className="tycoon-landing-card__content xk-info-card__content">
                        <div className="tycoon-landing-feature__badge-wrapper">
                          <div className={`tycoon-landing-feature__badge tycoon-landing-feature__badge_style-${mapBadge(reason.tone)}`}>
                            <div className="tycoon-landing-feature__badge-content">{reason.title}</div>
                          </div>
                        </div>
                        <p className={`tycoon-landing-feature__info xk-info-card__text tycoon-landing-feature__info_style-${mapInfo(reason.tone)}`}>
                          {reason.text}
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="https://landing.streamcraft.net/tycoon/img/general/card-shadow.png"
                    className="tycoon-landing-card__shadow"
                    alt=""
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="xk-feature-grid mt-75">
            {features.map((feature, index) => (
              <article key={feature.title} className="tycoon-landing-feature">
                <div className={`tycoon-landing-card ${index % 2 === 0 ? 'tycoon-landing-card_style-violet' : 'tycoon-landing-card_style-blue'}`}>
                  <div className="tycoon-landing-card__wrapper">
                    <div className="tycoon-landing-card__wrapper-inner">
                      <div className="tycoon-landing-card__content xk-simple-feature">
                        <div className="tycoon-landing-feature__badge-wrapper">
                          <div className={`tycoon-landing-feature__badge ${index % 2 === 0 ? 'tycoon-landing-feature__badge_style-violet' : 'tycoon-landing-feature__badge_style-blue'}`}>
                            <div className="tycoon-landing-feature__badge-content">{feature.title}</div>
                          </div>
                        </div>
                        <p className={`tycoon-landing-feature__info ${index % 2 === 0 ? 'tycoon-landing-feature__info_style-violet' : 'tycoon-landing-feature__info_style-blue'} mt-50`}>
                          {feature.text}
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="https://landing.streamcraft.net/tycoon/img/general/card-shadow.png"
                    className="tycoon-landing-card__shadow"
                    alt=""
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="tycoon-landing-section tycoon-landing-section_style-brown">
        <div className="tycoon-landing-section__background" />
        <div className="tycoon-landing-section__background _righted" />
        <div className="tycoon-landing-section__line" />
        <div className="tycoon-landing-section__effect" />

        <div className="tycoon-landing-wrapper py-150">
          <div className="tycoon-landing-section__header">
            <div className="tycoon-landing-section__header-icon _absolution">
              <img
                src="https://landing.streamcraft.net/tycoon/img/general/section-brown-heading-icon.svg"
                alt=""
              />
            </div>
            <h2 className="tycoon-landing-section__header-text tycoon-color-yellow mt-35">
              Подавай заявку
              <br />
              <span className="tycoon-landing-section__header-mark tycoon-color-orange-2">
                И присоединяйся к XK SMP
              </span>
            </h2>
          </div>

          <div className="tycoon-landing-feature mt-50">
            <div className="tycoon-landing-card">
              <div className="tycoon-landing-card__wrapper">
                <div className="tycoon-landing-card__wrapper-inner">
                  <div className="tycoon-landing-card__content xk-cta-content">
                    <div className="tycoon-landing-feature__badge-wrapper">
                      <div className="tycoon-landing-feature__badge">
                        <div className="tycoon-landing-feature__badge-content">Discord Whitelist</div>
                      </div>
                    </div>

                    <p className="tycoon-landing-feature__info tycoon-landing-feature__info_style-orange mt-50">
                      Если тебе нужен приватный Minecraft сервер с
                      <span className="tycoon-landing-feature__info-mark-1"> долгой перспективой</span>,
                      политикой, городами, королевствами и
                      <span className="tycoon-landing-feature__info-mark-2"> настоящим чувством живого мира</span>,
                      тебе сюда.
                    </p>

                    <div className="xk-cta-actions">
                      <a
                        href="#"
                        className="tycoon-landing-btn tycoon-landing-btn_style-success"
                      >
                        <div className="tycoon-landing-btn__content text-40">
                          Открыть Discord
                          <img
                            src="https://landing.streamcraft.net/tycoon/img/general/btn-success-arrow-right.svg"
                            className="tycoon-landing-btn__content-arrow ml-1"
                            alt=""
                          />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <img
                src="https://landing.streamcraft.net/tycoon/img/general/card-shadow.png"
                className="tycoon-landing-card__shadow"
                alt=""
              />
            </div>
          </div>
        </div>

        <img
          src="https://landing.streamcraft.net/tycoon/img/general/section-ending.png"
          className="tycoon-landing-section__ending"
          alt=""
        />
      </section>
    </main>
  )
}

function mapTone(tone: string) {
  if (tone === 'green') return 'green'
  if (tone === 'gold') return 'gold'
  return 'violet'
}

function mapBadge(tone: string) {
  if (tone === 'green') return 'green'
  if (tone === 'gold') return 'orange'
  return 'violet'
}

function mapInfo(tone: string) {
  if (tone === 'green') return 'green'
  if (tone === 'gold') return 'orange'
  return 'violet'
}
