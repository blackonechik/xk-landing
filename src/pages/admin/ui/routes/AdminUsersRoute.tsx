import { useState } from 'react'
import { AdminConfirmationDialog } from '../components/AdminConfirmationDialog'
import { PlayerRolesEditorModal } from '../components/PlayerRolesEditorModal'
import { UsersSection } from '../sections/UsersSection'
import { updateAdminPlayerBlocked, updateAdminPlayerRoles } from '../../model/api'
import { playerRoleOptions } from '../../model/constants'
import type {
  ConfirmationState,
  PlayerRolesEditorState,
} from '../../model/types'
import { useAdminPageContext } from '../../model/admin-page-context'
import type { AdminPlayerRow } from '../../model/api'

export function AdminUsersRoute() {
  const {
    dashboard,
    isSessionAdmin,
    setDashboard,
    showErrorToast,
    showSuccessToast,
  } = useAdminPageContext()
  const [confirmState, setConfirmState] = useState<ConfirmationState>(null)
  const [playerRolesEditor, setPlayerRolesEditor] =
    useState<PlayerRolesEditorState>(null)
  const [isSavingPlayerRoles, setIsSavingPlayerRoles] = useState(false)

  function requestConfirmation(nextState: ConfirmationState) {
    setConfirmState(nextState)
  }

  async function handleTogglePlayerBlocked(player: AdminPlayerRow) {
    if (!isSessionAdmin) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    try {
      await updateAdminPlayerBlocked(player.lowercaseNickname, !player.blocked)
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              players: prev.players.map((item) =>
                item.lowercaseNickname === player.lowercaseNickname
                  ? { ...item, blocked: !item.blocked }
                  : item,
              ),
            }
          : prev,
      )
      showSuccessToast(
        player.blocked ? 'Игрок разблокирован' : 'Игрок заблокирован',
        player.nickname,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось изменить статус игрока',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  async function handleSavePlayerRoles() {
    if (!isSessionAdmin || !playerRolesEditor) {
      return
    }

    setIsSavingPlayerRoles(true)

    try {
      const roles = await updateAdminPlayerRoles(
        playerRolesEditor.player.lowercaseNickname,
        playerRolesEditor.roles,
      )

      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              players: prev.players.map((item) =>
                item.lowercaseNickname ===
                playerRolesEditor.player.lowercaseNickname
                  ? { ...item, roles }
                  : item,
              ),
            }
          : prev,
      )
      showSuccessToast(
        'Роли пользователя обновлены',
        playerRolesEditor.player.nickname,
      )
      setPlayerRolesEditor(null)
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить роли',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingPlayerRoles(false)
    }
  }

  return (
    <>
      <UsersSection
        players={dashboard?.players ?? []}
        playerRoleOptions={playerRoleOptions}
        setPlayerRolesEditor={setPlayerRolesEditor}
        requestConfirmation={requestConfirmation}
        handleTogglePlayerBlocked={handleTogglePlayerBlocked}
      />

      <PlayerRolesEditorModal
        playerRolesEditor={playerRolesEditor}
        isSavingPlayerRoles={isSavingPlayerRoles}
        playerRoleOptions={playerRoleOptions}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPlayerRolesEditor(null)
          }
        }}
        onRolesChange={(roles) =>
          setPlayerRolesEditor((prev) =>
            prev
              ? {
                  ...prev,
                  roles,
                }
              : prev,
          )
        }
        onSubmit={() => void handleSavePlayerRoles()}
      />

      <AdminConfirmationDialog
        confirmState={confirmState}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setConfirmState(null)
          }
        }}
      />
    </>
  )
}
