import { Button, Chip, Table, Text } from '@heroui/react'
import type { SiteNavigationItem, SiteNavigationRole } from '@/entities/site'
import { getNavigationIcon } from '@/widgets/account/sidebar/model/account-sidebar-menu'
import { navigationRoleOptions } from '../../model/constants'
import { AdminTableCard } from '../components/AdminTableCard'
import type { ConfirmationState } from '../../model/types'

type NavigationSectionProps = {
  navigationItems: SiteNavigationItem[]
  isSavingSettings: boolean
  openNavigationEditor: (item: SiteNavigationItem) => void
  requestConfirmation: (nextState: ConfirmationState) => void
  handleSaveNavigation: (
    items: SiteNavigationItem[],
    successMessage: string,
    description?: string,
  ) => Promise<void>
}

export function NavigationSection({
  navigationItems,
  isSavingSettings,
  openNavigationEditor,
  requestConfirmation,
  handleSaveNavigation,
}: NavigationSectionProps) {
  return (
    <AdminTableCard
      title="Навигация сайта"
      description="Редактирование названий, иконок, аудитории и статуса пунктов меню кабинета."
    >
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Настройки навигации"
            className="min-w-[1120px]"
          >
            <Table.Header>
              <Table.Column isRowHeader>Раздел</Table.Column>
              <Table.Column>Секция</Table.Column>
              <Table.Column>Аудитория</Table.Column>
              <Table.Column>Статус</Table.Column>
              <Table.Column>Действия</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="px-4 py-6 text-sm text-muted">
                  Разделов навигации пока нет.
                </div>
              )}
            >
              {navigationItems.map((item) => (
                <Table.Row key={item.key} id={item.key}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <span className="text-muted">
                        {getNavigationIcon(item.icon)}
                      </span>
                      <div className="grid gap-1">
                        <Text type="body-sm">{item.label}</Text>
                        <Text color="muted" type="body-sm">
                          {item.key}
                        </Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {item.section === 'primary'
                      ? 'Основное меню'
                      : 'Дополнительно'}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-2">
                      {item.audiences.map((role: SiteNavigationRole) => (
                        <Chip key={`${item.key}-${role}`} variant="soft">
                          {navigationRoleOptions.find(
                            (option) => option.value === role,
                          )?.label ?? role}
                        </Chip>
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      color={
                        item.deleted
                          ? 'danger'
                          : item.visible
                            ? 'success'
                            : 'default'
                      }
                      variant="soft"
                    >
                      {item.deleted
                        ? 'Удален'
                        : item.visible
                          ? 'Виден'
                          : 'Скрыт'}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        isDisabled={isSavingSettings}
                        size="sm"
                        variant="ghost"
                        onPress={() => openNavigationEditor(item)}
                      >
                        Редактировать
                      </Button>
                      <Button
                        isDisabled={isSavingSettings}
                        size="sm"
                        variant="ghost"
                        onPress={() =>
                          requestConfirmation({
                            title: item.visible
                              ? 'Скрыть раздел?'
                              : 'Показать раздел?',
                            description: item.visible
                              ? `Раздел ${item.label} исчезнет из меню для выбранных групп.`
                              : `Раздел ${item.label} снова появится в меню.`,
                            confirmLabel: item.visible ? 'Скрыть' : 'Показать',
                            confirmColor: item.visible ? 'warning' : 'success',
                            onConfirm: () =>
                              handleSaveNavigation(
                                navigationItems.map((candidate) =>
                                  candidate.key === item.key
                                    ? {
                                        ...candidate,
                                        visible: !candidate.visible,
                                        deleted: false,
                                      }
                                    : candidate,
                                ),
                                item.visible
                                  ? 'Раздел скрыт'
                                  : 'Раздел показан',
                                item.label,
                              ),
                          })
                        }
                      >
                        {item.visible ? 'Скрыть' : 'Показать'}
                      </Button>
                      <Button
                        isDisabled={isSavingSettings}
                        size="sm"
                        variant={item.deleted ? 'secondary' : 'ghost'}
                        onPress={() =>
                          requestConfirmation({
                            title: item.deleted
                              ? 'Вернуть раздел?'
                              : 'Удалить раздел?',
                            description: item.deleted
                              ? `Раздел ${item.label} снова появится в настройках и сможет отображаться в меню.`
                              : `Раздел ${item.label} будет удален из навигации.`,
                            confirmLabel: item.deleted ? 'Вернуть' : 'Удалить',
                            confirmColor: item.deleted ? 'success' : 'danger',
                            onConfirm: () =>
                              handleSaveNavigation(
                                navigationItems.map((candidate) =>
                                  candidate.key === item.key
                                    ? {
                                        ...candidate,
                                        deleted: !candidate.deleted,
                                        visible: candidate.deleted
                                          ? true
                                          : candidate.visible,
                                      }
                                    : candidate,
                                ),
                                item.deleted
                                  ? 'Раздел восстановлен'
                                  : 'Раздел удален',
                                item.label,
                              ),
                          })
                        }
                      >
                        {item.deleted ? 'Вернуть' : 'Удалить'}
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
