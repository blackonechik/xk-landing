import type { Dispatch, SetStateAction } from 'react'
import { Button, Chip, Table, Text } from '@heroui/react'
import type { AdminPlayerRow } from '../../model/api'
import { formatDate } from '../../lib/admin-format'
import { getButtonToneClass } from '../../lib/getButtonToneClass'
import type {
  ConfirmationState,
  PlayerRolesEditorState,
} from '../../model/types'
import { AdminTableCard } from '../components/AdminTableCard'

type UsersSectionProps = {
  players: AdminPlayerRow[]
  playerRoleOptions: { value: string; label: string }[]
  setPlayerRolesEditor: Dispatch<SetStateAction<PlayerRolesEditorState>>
  requestConfirmation: (nextState: ConfirmationState) => void
  handleTogglePlayerBlocked: (player: AdminPlayerRow) => Promise<void>
}

export function UsersSection({
  players,
  playerRoleOptions,
  setPlayerRolesEditor,
  requestConfirmation,
  handleTogglePlayerBlocked,
}: UsersSectionProps) {
  return (
    <AdminTableCard
      title="Пользователи"
      description="Пользователи из AUTH + LuckPerms, статус привязки Discord и блокировки."
    >
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label="Пользователи" className="min-w-[900px]">
            <Table.Header>
              <Table.Column isRowHeader>Игрок</Table.Column>
              <Table.Column>Discord</Table.Column>
              <Table.Column>Роли</Table.Column>
              <Table.Column>Последний вход</Table.Column>
              <Table.Column>Регистрация</Table.Column>
              <Table.Column>Статус</Table.Column>
              <Table.Column>Действия</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="px-4 py-6 text-sm text-muted">
                  Игроков пока нет.
                </div>
              )}
            >
              {players.map((player) => (
                <Table.Row
                  key={player.lowercaseNickname}
                  id={player.lowercaseNickname}
                >
                  <Table.Cell>{player.nickname}</Table.Cell>
                  <Table.Cell>
                    <div className="grid gap-1">
                      <Chip
                        color={player.discordLinked ? 'success' : 'default'}
                        variant="soft"
                      >
                        {player.discordLinked ? 'Привязан' : 'Не привязан'}
                      </Chip>
                      <Text color="muted" type="body-sm">
                        {player.discordLinked && player.discordId
                          ? player.discordId
                          : '—'}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-2">
                      {player.roles.map((role) => (
                        <Chip
                          key={`${player.lowercaseNickname}-${role}`}
                          variant="soft"
                        >
                          {playerRoleOptions.find(
                            (option) => option.value === role,
                          )?.label ?? role}
                        </Chip>
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{formatDate(player.lastLoginAt)}</Table.Cell>
                  <Table.Cell>{formatDate(player.registeredAt)}</Table.Cell>
                  <Table.Cell>
                    <Chip
                      color={player.blocked ? 'danger' : 'success'}
                      variant="soft"
                    >
                      {player.blocked ? 'Заблокирован' : 'Активен'}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onPress={() =>
                          setPlayerRolesEditor({
                            player,
                            roles: [...player.roles],
                          })
                        }
                      >
                        Роли
                      </Button>
                      <Button
                        className={getButtonToneClass(
                          player.blocked ? 'success' : 'danger',
                        )}
                        size="sm"
                        onPress={() =>
                          requestConfirmation({
                            title: player.blocked
                              ? 'Разблокировать игрока?'
                              : 'Заблокировать игрока?',
                            description: player.blocked
                              ? `${player.nickname} снова получит доступ к кабинету и действиям.`
                              : `${player.nickname} будет ограничен в доступе к кабинету.`,
                            confirmLabel: player.blocked
                              ? 'Разблокировать'
                              : 'Заблокировать',
                            confirmColor: player.blocked ? 'success' : 'danger',
                            onConfirm: () => handleTogglePlayerBlocked(player),
                          })
                        }
                      >
                        {player.blocked ? 'Разблокировать' : 'Заблокировать'}
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
