import type { Dispatch, SetStateAction } from 'react'
import { Button, Chip, Table, Text } from '@heroui/react'
import type { AdminApplicationRow } from '../../model/api'
import { getApplicationStatusMeta } from '../../model/constants'
import { formatDate } from '../../lib/admin-format'
import { AdminTableCard } from '../components/AdminTableCard'
import type { ConfirmationState } from '../../model/types'

type ApplicationsSectionProps = {
  applications: AdminApplicationRow[]
  applicationNotes: Record<string, string>
  setApplicationNotes: Dispatch<SetStateAction<Record<string, string>>>
  requestConfirmation: (nextState: ConfirmationState) => void
  handleUpdateApplication: (
    application: AdminApplicationRow,
    status: string,
  ) => Promise<void>
}

export function ApplicationsSection({
  applications,
  applicationNotes,
  setApplicationNotes,
  requestConfirmation,
  handleUpdateApplication,
}: ApplicationsSectionProps) {
  return (
    <AdminTableCard
      title="Заявки"
      description="Очередь вступления, контакты игроков и решения администрации."
    >
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label="Заявки игроков" className="min-w-[1180px]">
            <Table.Header>
              <Table.Column isRowHeader>Игрок</Table.Column>
              <Table.Column>Контакты</Table.Column>
              <Table.Column>Планы</Table.Column>
              <Table.Column>Статус</Table.Column>
              <Table.Column>Комментарий</Table.Column>
              <Table.Column>Обновлено</Table.Column>
              <Table.Column>Действия</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="px-4 py-6 text-sm text-muted">
                  Новых заявок нет.
                </div>
              )}
            >
              {applications.map((application) => (
                <Table.Row key={application.id} id={application.id}>
                  <Table.Cell>
                    <div className="grid gap-1">
                      <Text type="body-sm">{application.nickname}</Text>
                      <Text color="muted" type="body-sm">
                        {application.age} лет
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="grid gap-1 text-sm">
                      <span>{application.contact}</span>
                      <span className="text-muted">{application.telegram}</span>
                      <span className="text-muted">{application.discord}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="min-w-[240px]">
                    <Text color="muted" type="body-sm">
                      {application.serverPlans}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      color={getApplicationStatusMeta(application.status).color}
                      variant="soft"
                    >
                      {getApplicationStatusMeta(application.status).label}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="min-w-[260px]">
                    <textarea
                      className="min-h-24 w-full rounded-[calc(var(--radius-lg)-2px)] border border-default-200 bg-content1 px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                      value={
                        applicationNotes[application.id] ??
                        application.reviewNote ??
                        ''
                      }
                      onChange={(event) =>
                        setApplicationNotes((prev) => ({
                          ...prev,
                          [application.id]: event.target.value,
                        }))
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>{formatDate(application.updatedAt)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onPress={() =>
                          requestConfirmation({
                            title: 'Отправить заявку на рассмотрение?',
                            description: `Статус заявки ${application.nickname} изменится на "На рассмотрении".`,
                            confirmLabel: 'Подтвердить',
                            confirmColor: 'warning',
                            onConfirm: () =>
                              handleUpdateApplication(application, 'review'),
                          })
                        }
                      >
                        На рассмотрении
                      </Button>
                      <Button
                        className="bg-success text-success-foreground hover:bg-success/90"
                        size="sm"
                        onPress={() =>
                          requestConfirmation({
                            title: 'Принять заявку?',
                            description: `Игрок ${application.nickname} будет отмечен как принятый.`,
                            confirmLabel: 'Принять',
                            confirmColor: 'success',
                            onConfirm: () =>
                              handleUpdateApplication(application, 'accepted'),
                          })
                        }
                      >
                        Принять
                      </Button>
                      <Button
                        className="bg-danger text-danger-foreground hover:bg-danger/90"
                        size="sm"
                        onPress={() =>
                          requestConfirmation({
                            title: 'Отклонить заявку?',
                            description: `Заявка игрока ${application.nickname} будет отклонена.`,
                            confirmLabel: 'Отклонить',
                            confirmColor: 'danger',
                            onConfirm: () =>
                              handleUpdateApplication(application, 'rejected'),
                          })
                        }
                      >
                        Отклонить
                      </Button>
                    </div>
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
