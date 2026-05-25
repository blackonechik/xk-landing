import { Chip, Table } from '@heroui/react'
import { FileText, ShieldCheck, TicketPercent, Wallet } from 'lucide-react'
import type { AdminDashboard } from '../../model/api'
import type { AdminStats } from '../../model/types'
import { formatDate } from '../../lib/admin-format'
import { getPaymentStatusMeta } from '../../model/constants'
import { AdminTableCard } from '../components/AdminTableCard'
import { HeroSectionCard } from '@/shared/ui/hero-page'

type OverviewSectionProps = {
  dashboard: AdminDashboard | null
  stats: AdminStats
}

export function OverviewSection({ dashboard, stats }: OverviewSectionProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HeroSectionCard
          gradient="emerald"
          icon={<Wallet size={40} />}
          label="Успешних платежей :"
          value={stats.paidCount}
        />
        <HeroSectionCard
          gradient="violet"
          icon={<ShieldCheck size={40} />}
          label="Заявки:"
          value={stats.totalApplications || '0'}
        />
        <HeroSectionCard
          gradient="amber"
          icon={<FileText size={40} />}
          label="Посты:"
          value={stats.publishedPosts || '0'}
        />
        <HeroSectionCard
          gradient="sky"
          icon={<TicketPercent size={40} />}
          label="В whitelist:"
          value={stats.totalWhitelist || '0'}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminTableCard
          title="Сводка"
          description="Главные показатели по сайту и серверу."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <HeroSectionCard
              gradient="emerald"
              title="Оплачено"
              description={stats.paidCount}
            />
            <HeroSectionCard
              gradient="amber"
              title="В ожидании"
              description={stats.pendingCount}
            />
            <HeroSectionCard
              gradient="rose"
              title="Логов жизней"
              description={stats.totalLifeLogs}
            />
            <HeroSectionCard
              gradient="violet"
              title="Активных промокодов"
              description={stats.activePromoCodes}
            />
            <HeroSectionCard
              gradient="sky"
              title="Новых заявок"
              description={stats.pendingApplications}
            />
            <HeroSectionCard
              gradient="aqua"
              title="Опубликованных постов"
              description={stats.publishedPosts}
            />
            <HeroSectionCard
              gradient="ember"
              title="Заблокированных игроков"
              description={stats.blockedPlayers}
            />
            <HeroSectionCard
              gradient="lime"
              title="В whitelist"
              description={stats.totalWhitelist}
            />
          </div>
        </AdminTableCard>

        <AdminTableCard
          title="Последние платежи"
          description="Свежие покупки и изменения статусов оплаты."
        >
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Последние платежи"
                className="min-w-[620px]"
              >
                <Table.Header>
                  <Table.Column isRowHeader>Игрок</Table.Column>
                  <Table.Column>Товар</Table.Column>
                  <Table.Column>Сумма</Table.Column>
                  <Table.Column>Статус</Table.Column>
                  <Table.Column>Обновлен</Table.Column>
                </Table.Header>
                <Table.Body
                  renderEmptyState={() => (
                    <div className="px-4 py-6 text-sm text-muted">
                      Платежей пока нет.
                    </div>
                  )}
                >
                  {(dashboard?.payments ?? []).slice(0, 8).map((payment) => (
                    <Table.Row key={payment.id} id={payment.id}>
                      <Table.Cell>{payment.nickname}</Table.Cell>
                      <Table.Cell>{payment.productName}</Table.Cell>
                      <Table.Cell>{payment.amountRub} руб.</Table.Cell>
                      <Table.Cell>
                        <Chip
                          color={getPaymentStatusMeta(payment.status).color}
                          variant="soft"
                        >
                          {getPaymentStatusMeta(payment.status).label}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>{formatDate(payment.updatedAt)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </AdminTableCard>
      </div>
    </div>
  )
}
