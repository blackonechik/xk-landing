import type { ReactNode } from 'react'
import { Chip, Text } from '@heroui/react'
import { AccountSidebar } from '@/widgets/account/sidebar'
import type { AccountPayload } from '@/entities/account'
import type { BankView } from '@/widgets/account/bank-cabinet'

type AccountLayoutProps = {
  account: AccountPayload
  currentSection: 'home' | 'bank'
  activeBankView?: BankView
  onBankViewNavigate: (view: BankView) => void
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function AccountLayout({
  account,
  currentSection,
  activeBankView,
  onBankViewNavigate,
  eyebrow,
  title,
  description,
  actions,
  children,
}: AccountLayoutProps) {
  return (
    <main className="xk-account-layout xk-hero-scope">
      <div className="xk-account-layout__frame">
        <div className="xk-account-layout__rail">
          <AccountSidebar
            account={account}
            activeBankView={activeBankView}
            currentSection={currentSection}
            onBankViewNavigate={onBankViewNavigate}
          />
        </div>

        <section className="xk-account-layout__main">
          <div className="xk-account-layout__scroll">
            <header className="xk-account-layout__hero">
              <div className="xk-account-layout__hero-copy">
                {eyebrow ? (
                  <Chip color="accent" variant="soft">
                    {eyebrow}
                  </Chip>
                ) : null}
                <div className="xk-account-layout__hero-text">
                  <Text type="h1">{title}</Text>
                  {description ? (
                    <Text color="muted" type="body">
                      {description}
                    </Text>
                  ) : null}
                </div>
              </div>
              {actions ? (
                <div className="xk-account-layout__actions">{actions}</div>
              ) : null}
            </header>

            <div className="xk-account-layout__content">{children}</div>
          </div>
        </section>
      </div>
    </main>
  )
}