import { Button, Chip, Table } from '@heroui/react'
import type { AdminWhitelistRow } from '../../model/api'
import { formatDate } from '../../lib/admin-format'
import { getButtonToneClass } from '../../lib/getButtonToneClass'
import type { ConfirmationState } from '../../model/types'
import { AdminTableCard } from '../components/AdminTableCard'

type WhitelistSectionProps = {
  whitelist: AdminWhitelistRow[]
  onOpenCreate: () => void
  requestConfirmation: (nextState: ConfirmationState) => void
  handleDeleteWhitelistEntry: (entry: AdminWhitelistRow) => Promise<void>
}

export function WhitelistSection({
  whitelist,
  onOpenCreate,
  requestConfirmation,
  handleDeleteWhitelistEntry,
}: WhitelistSectionProps) {
  return (
    <AdminTableCard
      title="Whitelist"
      description="Белый список, источник попадания и ручное удаление записей."
      action={<Button onPress={onOpenCreate}>Добавить игрока</Button>}
    >
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label="Whitelist" className="min-w-[900px]">
            <Table.Header>
              <Table.Column isRowHeader>Игрок</Table.Column>
              <Table.Column>Источник</Table.Column>
              <Table.Column>Покупка</Table.Column>
              <Table.Column>Статус</Table.Column>
              <Table.Column>Добавлен</Table.Column>
              <Table.Column>Обновлен</Table.Column>
              <Table.Column>Действия</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="px-4 py-6 text-sm text-muted">
                  Whitelist пуст.
                </div>
              )}
            >
              {whitelist.map((entry) => (
                <Table.Row key={entry.nickname} id={entry.nickname}>
                  <Table.Cell>{entry.nickname}</Table.Cell>
                  <Table.Cell>
                    {entry.source ?? 'Источник не указан'}
                  </Table.Cell>
                  <Table.Cell>{entry.purchaseId ?? '—'}</Table.Cell>
                  <Table.Cell>
                    <Chip
                      color={entry.active ? 'success' : 'default'}
                      variant="soft"
                    >
                      {entry.active ? 'В whitelist' : 'Неактивен'}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>{formatDate(entry.createdAt)}</Table.Cell>
                  <Table.Cell>{formatDate(entry.updatedAt)}</Table.Cell>
                  <Table.Cell>
                    <Button
                      className={getButtonToneClass('danger')}
                      size="sm"
                      onPress={() =>
                        requestConfirmation({
                          title: 'Удалить из whitelist?',
                          description: `${entry.nickname} будет удален из белого списка.`,
                          confirmLabel: 'Удалить',
                          confirmColor: 'danger',
                          onConfirm: () => handleDeleteWhitelistEntry(entry),
                        })
                      }
                    >
                      Удалить
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </AdminTableCard>
  )
}
