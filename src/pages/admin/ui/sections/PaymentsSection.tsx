import { Chip, Table } from '@heroui/react'
import type { AdminPaymentRow } from '../../model/api'
import { formatDate } from '../../lib/admin-format'
import { getPaymentStatusMeta } from '../../model/constants'
import { AdminTableCard } from '../components/AdminTableCard'

type PaymentsSectionProps = {
  payments: AdminPaymentRow[]
}

export function PaymentsSection({ payments }: PaymentsSectionProps) {
  return (
    <AdminTableCard
      title="Покупки"
      description="Полный журнал платежей, провайдеров и состояний оплаты."
    >
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label="Покупки" className="min-w-[1140px]">
            <Table.Header>
              <Table.Column isRowHeader>Игрок</Table.Column>
              <Table.Column>Товар</Table.Column>
              <Table.Column>Сумма</Table.Column>
              <Table.Column>Статус</Table.Column>
              <Table.Column>Провайдер</Table.Column>
              <Table.Column>Payment ID</Table.Column>
              <Table.Column>Создан</Table.Column>
              <Table.Column>Обновлен</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="px-4 py-6 text-sm text-muted">
                  Покупок пока нет.
                </div>
              )}
            >
              {payments.map((payment) => (
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
                  <Table.Cell>{payment.provider}</Table.Cell>
                  <Table.Cell>
                    {payment.providerPaymentId ?? payment.id}
                  </Table.Cell>
                  <Table.Cell>{formatDate(payment.createdAt)}</Table.Cell>
                  <Table.Cell>{formatDate(payment.updatedAt)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </AdminTableCard>
  )
}
