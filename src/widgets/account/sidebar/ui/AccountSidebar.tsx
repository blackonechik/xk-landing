import { Button, Card, Chip, buttonVariants } from '@heroui/react'
import {
  ArrowRightLeft,
  CreditCard,
  Crown,
  History,
  House,
  Landmark,
} from 'lucide-react'
import AnimatedLink from '@/components/AnimatedLink'
import { PlayerAvatar, type AccountPayload } from '@/entities/account'
import type { BankView } from '@/widgets/account/bank-cabinet'

type AccountSidebarProps = {
  account: AccountPayload
  currentSection: 'home' | 'bank'
  activeBankView?: BankView
  onBankViewNavigate: (view: BankView) => void
}

type SidebarButtonProps = {
  children: React.ReactNode
  current?: boolean
  onPress?: () => void
  to?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const bankItems = [
  {
    icon: <CreditCard size={18} />,
    label: 'Карты',
    view: 'cards',
  },
  {
    icon: <ArrowRightLeft size={18} />,
    label: 'Перевод',
    view: 'transfer',
  },
  {
    icon: <History size={18} />,
    label: 'История',
    view: 'history',
  },
] satisfies { icon: React.ReactNode; label: string; view: BankView }[]

function SidebarButton({
  children,
  current = false,
  onPress,
  to,
  disabled = false,
  size = 'lg',
}: SidebarButtonProps) {
  const className = 'w-full justify-start'
  const variant = current ? 'secondary' : 'ghost'

  if (to) {
    return (
      <AnimatedLink
        className={buttonVariants({
          className,
          size,
          variant,
        })}
        to={to}
      >
        {children}
      </AnimatedLink>
    )
  }

  return (
    <Button
      className={className}
      isDisabled={disabled}
      onPress={onPress}
      size={size}
      variant={variant}
    >
      {children}
    </Button>
  )
}

export function AccountSidebar({
  account,
  currentSection,
  activeBankView = 'cards',
  onBankViewNavigate,
}: AccountSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <Card>
        <Card.Header className="flex items-center gap-4">
          <PlayerAvatar
            className="size-14 shrink-0 border border-white/10 bg-white/5"
            nickname={account.player.nickname}
          />
          <div className="min-w-0">
            <Card.Title className="truncate">{account.player.nickname}</Card.Title>
            <Card.Description>Личный кабинет игрока</Card.Description>
          </div>
        </Card.Header>

        <Card.Content className="flex flex-col gap-2">
          <SidebarButton current={currentSection === 'home'} to="/cabinet">
            <span className="flex items-center gap-3">
              <House size={18} />
              <span>Главная</span>
            </span>
          </SidebarButton>

          <div className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/4 p-2">
            <SidebarButton
              current={currentSection === 'bank' && activeBankView === 'cards'}
              onPress={() => onBankViewNavigate('cards')}
            >
              <span className="flex items-center gap-3">
                <Landmark size={18} />
                <span>Банк</span>
              </span>
            </SidebarButton>

            <div className="flex flex-col gap-1 pl-3">
              {bankItems.map((item) => (
                <SidebarButton
                  current={currentSection === 'bank' && activeBankView === item.view}
                  key={item.view}
                  onPress={() => onBankViewNavigate(item.view)}
                  size="sm"
                >
                  <span className="flex items-center gap-3 text-sm">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                </SidebarButton>
              ))}
            </div>
          </div>

          <Button className="w-full justify-start" isDisabled size="lg" variant="ghost">
            <span className="flex w-full items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <Crown size={18} />
                <span>Королевства</span>
              </span>
              <Chip variant="soft">В разработке</Chip>
            </span>
          </Button>
        </Card.Content>
      </Card>
    </aside>
  )
}