import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { Alert, Spinner } from '@heroui/react'
import { AdminPageProvider, useAdminPageContext } from '../model/admin-page-context'
import { AccountLayout } from '@/widgets/account/layout'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'
import {
  getAdminViewFromPathname,
  getAdminViewPath,
} from '@/widgets/account/sidebar/model/account-sidebar-menu'

export function AdminPage() {
  return (
    <AdminPageProvider>
      <AdminPageShell />
    </AdminPageProvider>
  )
}

function AdminPageShell() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const selectedTab = getAdminViewFromPathname(pathname)
  const { account, error, isLoading } = useAdminPageContext()

  const content = (
    <div className="grid gap-6">
      {isLoading ? (
        <Alert status="accent">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Загружаем данные админки</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}

      {error ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}

      <Outlet />
    </div>
  )

  if (account) {
    return (
      <AccountLayout
        account={account}
        activeAdminView={selectedTab}
        currentSection="admin"
        onNavigate={(to) => {
          void navigate({ to })
        }}
        onAdminViewNavigate={(view) => {
          void navigate({ to: getAdminViewPath(view) })
        }}
        onBankViewNavigate={(view) => {
          void navigate({ to: `/cabinet/bank/${view}` })
        }}
        eyebrow="Администрирование"
        title="Админка"
        description="Заявки, посты, пользователи, навигация и платежные данные сайта."
        actions={
          <HeroLinkButton to="/cabinet/news" variant="secondary">
            Открыть ленту
          </HeroLinkButton>
        }
      >
        {content}
      </AccountLayout>
    )
  }

  return (
    <HeroPage
      eyebrow="Администрирование"
      title="Админка XK HARDCORE"
      description="Доступ к админке есть только у пользователей с ролью администратора сайта."
      narrow
    >
      {content}
    </HeroPage>
  )
}
