import { useEffect, useState, type ReactNode } from 'react'
import { AccountSidebar } from '@/widgets/account/sidebar'
import type { AccountPayload } from '@/entities/account'
import type { BankView } from '@/widgets/account/bank-cabinet'
import type { AdminView } from '@/widgets/account/sidebar/model/account-sidebar-menu'
import { PageHeader } from '@/shared/ui/page-header'

const accountSidebarDensityStorageKey = 'xk-account-sidebar-compact'

function getInitialSidebarCompact() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(accountSidebarDensityStorageKey) === 'true'
}

type AccountLayoutProps = {
  account: AccountPayload
  currentSection: 'home' | 'bank' | 'stats' | 'news' | 'admin'
  activeBankView?: BankView
  activeAdminView?: AdminView
  onBankViewNavigate: (view: BankView) => void
  onAdminViewNavigate?: (view: AdminView) => void
  onNavigate: (to: string) => void
  eyebrow?: string
  title?: string
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function AccountLayout({
  account,
  currentSection,
  activeBankView,
  activeAdminView,
  onBankViewNavigate,
  onAdminViewNavigate,
  onNavigate,
  eyebrow,
  title,
  description,
  actions,
  children,
}: AccountLayoutProps) {
  const [isSidebarCompact, setIsSidebarCompact] = useState(getInitialSidebarCompact)

  useEffect(() => {
    window.localStorage.setItem(
      accountSidebarDensityStorageKey,
      String(isSidebarCompact),
    )
  }, [isSidebarCompact])

  return (
    <main className="xk-account-layout xk-hero-scope">
      <div
        className="xk-account-layout__frame"
        data-sidebar-compact={isSidebarCompact ? 'true' : 'false'}
      >
        <div className="xk-account-layout__rail">
          <AccountSidebar
            account={account}
            activeAdminView={activeAdminView}
            activeBankView={activeBankView}
            compact={isSidebarCompact}
            currentSection={currentSection}
            onNavigate={onNavigate}
            onAdminViewNavigate={onAdminViewNavigate}
            onBankViewNavigate={onBankViewNavigate}
            onCompactToggle={() => {
              setIsSidebarCompact((currentValue) => !currentValue)
            }}
          />
        </div>

        <section className="xk-account-layout__main">
          <div className="xk-account-layout__scroll">
            {title && (
              <header className="xk-account-layout__hero">

                <PageHeader
                  actions={actions}
                  actionsClassName="flex flex-wrap items-center gap-3"
                  className="gap-4"
                  description={description}
                  descriptionClassName="xk-account-layout__description max-w-none"
                  eyebrow={eyebrow}
                  eyebrowClassName="xk-account-layout__eyebrow"
                  title={title}
                  titleClassName="xk-account-layout__title"
                  titleWrapClassName="xk-account-layout__hero-copy xk-account-layout__hero-text max-w-none"
                />
              </header>
            )}


            <div className="xk-account-layout__content">{children}</div>
          </div>
        </section>
      </div>
    </main>
  )
}
