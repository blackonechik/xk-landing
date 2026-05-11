import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageTransition, {
  PageTransitionProvider,
} from '../components/PageTransition'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'XK HARDCORE',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
      },
      {
        name: 'googlebot',
        content: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
      },
      {
        name: 'yandex',
        content: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  component: RootRouteContent,
  shellComponent: RootDocument,
})

function RootRouteContent() {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  )
}

function NotFoundPage() {
  return (
    <main className="tycoon-landing xk-legal-page">
      <section className="page-wrap xk-legal-shell">
        <p className="xk-overline">404</p>
        <h1 className="mc-footer-title">Страница не найдена</h1>
        <p className="xk-legal-lead">
          Такого раздела на XK HARDCORE нет. Проверь адрес или вернись на
          главную страницу.
        </p>
      </section>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PageTransitionProvider>
          <Header />
          {children}
          <Footer />
        </PageTransitionProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
