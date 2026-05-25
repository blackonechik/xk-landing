import { Button, Card, Chip, Table, Text } from '@heroui/react'
import type { AdminPromoCodeRow } from '../../model/api'
import { formatDate, formatPromoDiscount } from '../../lib/admin-format'
import { getPromoStatusMeta } from '../../model/constants'
import type { ConfirmationState } from '../../model/types'
import { AdminTableCard } from '../components/AdminTableCard'
import { LabeledInput } from '../components/LabeledInput'

type PromosSectionProps = {
  promoCodes: AdminPromoCodeRow[]
  promoCode: string
  discountType: 'percent' | 'fixed'
  discountValue: string
  maxUses: string
  maxUsesPerNickname: string
  startsAt: string
  endsAt: string
  isSavingPromo: boolean
  setPromoCode: (value: string) => void
  setDiscountType: (value: 'percent' | 'fixed') => void
  setDiscountValue: (value: string) => void
  setMaxUses: (value: string) => void
  setMaxUsesPerNickname: (value: string) => void
  setStartsAt: (value: string) => void
  setEndsAt: (value: string) => void
  handleCreatePromo: () => Promise<void>
  handleTogglePromoActive: (promo: AdminPromoCodeRow) => Promise<void>
  requestConfirmation: (nextState: ConfirmationState) => void
}

export function PromosSection({
  promoCodes,
  promoCode,
  discountType,
  discountValue,
  maxUses,
  maxUsesPerNickname,
  startsAt,
  endsAt,
  isSavingPromo,
  setPromoCode,
  setDiscountType,
  setDiscountValue,
  setMaxUses,
  setMaxUsesPerNickname,
  setStartsAt,
  setEndsAt,
  handleCreatePromo,
  handleTogglePromoActive,
  requestConfirmation,
}: PromosSectionProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <Card.Header>
          <Card.Title>Создать промокод</Card.Title>
        </Card.Header>
        <Card.Content className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <LabeledInput
            label="Код"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
            placeholder="WELCOME10"
          />
          <LabeledInput
            label="Тип скидки"
            value={discountType}
            onChange={(event) =>
              setDiscountType(event.target.value as 'percent' | 'fixed')
            }
            placeholder="percent или fixed"
          />
          <LabeledInput
            label="Значение скидки"
            value={discountValue}
            onChange={(event) => setDiscountValue(event.target.value)}
          />
          <LabeledInput
            label="Лимит использований"
            value={maxUses}
            onChange={(event) => setMaxUses(event.target.value)}
          />
          <LabeledInput
            label="Лимит на ник"
            value={maxUsesPerNickname}
            onChange={(event) => setMaxUsesPerNickname(event.target.value)}
          />
          <LabeledInput
            label="Активен с"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
          />
          <LabeledInput
            label="Активен до"
            type="datetime-local"
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
          />
          <Button
            onPress={() => void handleCreatePromo()}
            isDisabled={isSavingPromo}
          >
            {isSavingPromo ? 'Сохраняем...' : 'Создать промокод'}
          </Button>
        </Card.Content>
      </Card>

      <AdminTableCard
        title="Промокоды"
        description="Скидки, лимиты использования и состояние публикации."
      >
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Промокоды" className="min-w-[1040px]">
              <Table.Header>
                <Table.Column isRowHeader>Код</Table.Column>
                <Table.Column>Скидка</Table.Column>
                <Table.Column>Лимит</Table.Column>
                <Table.Column>На ник</Table.Column>
                <Table.Column>Использовано</Table.Column>
                <Table.Column>Статус</Table.Column>
                <Table.Column>Период</Table.Column>
                <Table.Column>Действия</Table.Column>
              </Table.Header>
              <Table.Body
                renderEmptyState={() => (
                  <div className="px-4 py-6 text-sm text-muted">
                    Промокодов пока нет.
                  </div>
                )}
              >
                {promoCodes.map((row) => (
                  <Table.Row key={row.id} id={row.id}>
                    <Table.Cell>{row.code}</Table.Cell>
                    <Table.Cell>{formatPromoDiscount(row)}</Table.Cell>
                    <Table.Cell>{row.maxUses ?? '—'}</Table.Cell>
                    <Table.Cell>{row.maxUsesPerNickname ?? '—'}</Table.Cell>
                    <Table.Cell>{row.usedCount}</Table.Cell>
                    <Table.Cell>
                      <Chip
                        color={getPromoStatusMeta(row.isActive).color}
                        variant="soft"
                      >
                        {getPromoStatusMeta(row.isActive).label}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="grid gap-1">
                        <Text color="muted" type="body-sm">
                          c {formatDate(row.startsAt)}
                        </Text>
                        <Text color="muted" type="body-sm">
                          до {formatDate(row.endsAt)}
                        </Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() =>
                          requestConfirmation({
                            title: row.isActive
                              ? 'Отключить промокод?'
                              : 'Включить промокод?',
                            description: `Промокод ${row.code} будет ${row.isActive ? 'отключен' : 'включен'}.`,
                            confirmLabel: row.isActive
                              ? 'Отключить'
                              : 'Включить',
                            confirmColor: row.isActive ? 'danger' : 'success',
                            onConfirm: () => handleTogglePromoActive(row),
                          })
                        }
                      >
                        {row.isActive ? 'Отключить' : 'Включить'}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </AdminTableCard>
    </div>
  )
}
