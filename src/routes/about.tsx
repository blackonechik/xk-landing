import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      {
        title: 'О сервере | XK SMP',
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="page-wrap about-page">
      <section className="content-panel">
        <p className="xk-overline">О сервере</p>
        <h1 className="mc-footer-title">XK SMP не про быстрый запуск, а про долгую историю</h1>
        <p className="xk-hero-text">
          Это приватный Minecraft RolePlay сервер, вдохновлённый форматом Dream
          SMP. В центре не магазин привилегий, а сами игроки, их союзы,
          конфликты, города и государства.
        </p>
        <p className="xk-hero-text">
          Мы строим мир, в котором архитектура, дипломатия, амбиции и личные
          решения имеют больший вес, чем донатные функции. Именно поэтому XK SMP
          задуман как долгий сервер, а не краткосрочный проект.
        </p>
      </section>
    </main>
  )
}
