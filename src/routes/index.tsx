import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const reasons = [
  {
    title: 'Города и королевства',
    text: 'Строй государства, заключай союзы и веди дипломатию, которая меняет карту мира.',
    tone: 'green',
  },
  {
    title: 'RP жизни',
    text: 'У каждого игрока всего 2 жизни, и каждая из них делает историю ценнее. Если всё пошло не по плану, другого игрока можно успеть поднять в течение нескольких минут после смерти. А когда жизни заканчиваются, их можно купить на сайте. Здесь особенно важно держаться вместе и не теряться с другими игроками.',
    tone: 'violet',
  },
  {
    title: 'Стабильность TPS',
    text: 'Сервер работает на мощном оборудовании и выдерживает высокую нагрузку без лагов. Команда постоянно оптимизирует сервер и плагины, чтобы ваш пинг не улетал на Марс.',
    tone: 'gold',
  },
]

const features = [
  {
    title: 'Dream SMP вайб',
    text: 'Сервер вдохновлён форматом сюжетного SMP, где самое важное создают сами игроки.',
  },
  {
    title: 'Защита аккаунта',
    text: 'Можно привязать аккаунт к Telegram или играть через лицензионный аккаунт, чтобы вход был надёжным и удобным.',
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
          'XK SMP — приватный Minecraft RolePlay сервер в духе Dream SMP: ваниль, RP-жизни, города, королевства и живой мир, где важны союзники, характер и история.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const shouldReduceMotion = useReducedMotion()
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)

  return (
    <main className="tycoon-landing xk-adapted">
      <a
        href="#header"
        className="tycoon-landing-btn index-fixed _left"
        style={{ opacity: 1 }}
      >
        <div className="tycoon-landing-btn__content px-35">
          <img
          src="/assets/img/general/btn-default-arrow-up.svg"
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
            src="/assets/img/general/btn-success-arrow-right.svg"
            className="tycoon-landing-btn__content-arrow ml-1"
            alt=""
          />
        </div>
      </a>

      <section id="header" className="tycoon-landing-header xk-header-hero">
        <motion.video
          src="/assets/background-hero.mp4"
          className="tycoon-landing-header__background"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 1.08,
                  filter: 'brightness(0.45) saturate(0.7) blur(8px)',
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
            filter: 'brightness(0.84) saturate(0.9) blur(0px)',
          }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="tycoon-landing-header__hero xk-minecraft-hero"
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 90, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="xk-minecraft-hero__glow" />
          <div className="xk-minecraft-hero__mountain xk-minecraft-hero__mountain_back" />
          <div className="xk-minecraft-hero__mountain xk-minecraft-hero__mountain_front" />
          <div className="xk-minecraft-hero__ground" />
          <div className="xk-minecraft-hero__castle" />
          <div className="xk-minecraft-hero__player">
            <span className="xk-minecraft-hero__head" />
            <span className="xk-minecraft-hero__body" />
            <span className="xk-minecraft-hero__arm xk-minecraft-hero__arm_left" />
            <span className="xk-minecraft-hero__arm xk-minecraft-hero__arm_right" />
            <span className="xk-minecraft-hero__leg xk-minecraft-hero__leg_left" />
            <span className="xk-minecraft-hero__leg xk-minecraft-hero__leg_right" />
          </div>
        </motion.div>

        <div className="tycoon-landing-header__container px-150">
          <div className="row justify-content-start">
            <div className="col-12 col-md-9 col-lg-6">
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: -84,
                        filter: 'blur(8px)',
                      }
                }
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.28, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tycoon-landing-header__logo xk-header-logo">
                <div className="xk-header-logo__text">
                  <span className="xk-header-logo__caption">
                      Приватный майнкрафт сервер
                    </span>
                    <strong>XK SMP</strong>
                    <small>РП • Ванилла • Живой мир</small>
                  </div>
                </div>

                <div className="tycoon-landing-header__container-content">
                  <p className="xk-header-copy">
                    Сервер, который не является однодневкой и не закроется из-за
                    неуплаты хостинга. Ванильный мир с RP-жизнями, городами,
                    королевствами и решениями, которые реально меняют историю.
                  </p>
                <motion.a
                  href="#apply"
                  className="tycoon-landing-btn tycoon-landing-btn_style-success"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  <div className="tycoon-landing-header__play-bright" />
                  <div className="tycoon-landing-btn__content text-40">
                    Подать заявку
                    <img
                      src="/assets/img/general/btn-success-arrow-right.svg"
                      className="tycoon-landing-btn__content-arrow ml-1"
                      alt=""
                    />
                  </div>
                </motion.a>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

        <motion.div
          className="tycoon-landing-header__frontline"
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.a
          href="#start"
          className="tycoon-landing-header__arrow"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/assets/img/general/header-arrow-down.svg"
            className="tycoon-landing-header__arrow-icon"
            alt=""
          />
        </motion.a>
      </section>

      <section
        id="start"
        className="tycoon-landing-section tycoon-landing-section_style-gradient-1 overflow-hidden"
      >
        <div className="tycoon-landing-section__background" />
        <div className="tycoon-landing-section__background _righted" />
        <div className="tycoon-landing-section__line" />

        <div className="tycoon-landing-wrapper py-30">
          <div className="tycoon-landing-section__header">
            <h2 className="tycoon-landing-section__header-text mt-35">
              Посмотрите трейлер сервера
            </h2>
          </div>

          <div className="index-start__layout mt-50">
            <div className="index-start__trailer">
              <div className="index-start__trailer-frame">
                <div className="index-start__trailer-surface">
                  {isTrailerPlaying ? (
                    <iframe
                      className="index-start__trailer-embed"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1"
                      title="XK SMP trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src="https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
                        alt=""
                        className="index-start__trailer-preview"
                      />
                      <div className="index-start__trailer-overlay" aria-hidden="true" />
                      <button
                        type="button"
                        className="index-start__trailer-launcher"
                        onClick={() => setIsTrailerPlaying(true)}
                        aria-label="Включить трейлер сервера"
                      >
                        <img
                          src="/assets/img/general/section-gradient-1-heading-icon.svg"
                          alt=""
                          className="index-start__trailer-launcher-icon"
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
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
                src="/assets/img/general/section-green-heading-icon.svg"
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
                    src="/assets/img/general/card-shadow.png"
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
                    src="/assets/img/general/card-shadow.png"
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
                src="/assets/img/general/section-brown-heading-icon.svg"
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
                        <div className="tycoon-landing-feature__badge-content">
                          Telegram Whitelist
                        </div>
                      </div>
                    </div>

                    <p className="tycoon-landing-feature__info tycoon-landing-feature__info_style-orange mt-50">
                      Если тебе нужен приватный Minecraft сервер с
                      <span className="tycoon-landing-feature__info-mark-1"> живой историей</span>,
                      союзниками, городами, королевствами и
                      <span className="tycoon-landing-feature__info-mark-2"> важными решениями</span>,
                      тебе сюда.
                    </p>

                    <div className="xk-cta-actions">
                      <a
                        href="#"
                        className="tycoon-landing-btn tycoon-landing-btn_style-success"
                      >
                        <div className="tycoon-landing-btn__content text-40">
                          Открыть Telegram
                          <img
                            src="/assets/img/general/btn-success-arrow-right.svg"
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
                src="/assets/img/general/card-shadow.png"
                className="tycoon-landing-card__shadow"
                alt=""
              />
            </div>
          </div>
        </div>

        <img
          src="/assets/img/general/section-ending.png"
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
