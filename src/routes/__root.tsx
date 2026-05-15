import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageTransition, {
  PageTransitionProvider,
} from '../components/PageTransition'
import {
  HeroLinkButton,
  HeroPage,
  HeroSectionCard,
} from '@/shared/ui/hero-page'

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
    <HeroPage
      eyebrow="404"
      title="Страница не найдена"
      description="Такого раздела на XK HARDCORE нет. Проверь адрес или вернись на главную страницу."
      actions={<HeroLinkButton to="/">На главную</HeroLinkButton>}
      narrow
    >
    </HeroPage>
  )
}
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var mode = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  root.classList.add(mode);
                  root.setAttribute('data-theme', mode);
                  root.style.colorScheme = mode;
                } catch (error) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <PageTransitionProvider>
          <Header />
          {children}
          <Footer />
        </PageTransitionProvider>
        <Scripts />
      </body>
    </html>
  )
}
