import { useState } from 'react'
import { AdminConfirmationDialog } from '../components/AdminConfirmationDialog'
import { WhitelistEditorModal } from '../components/WhitelistEditorModal'
import { WhitelistSection } from '../sections/WhitelistSection'
import { createAdminWhitelistEntry, deleteAdminWhitelistEntry } from '../../model/api'
import type { ConfirmationState } from '../../model/types'
import { useAdminPageContext } from '../../model/admin-page-context'
import type { AdminWhitelistRow } from '../../model/api'

export function AdminWhitelistRoute() {
  const {
    dashboard,
    isSessionAdmin,
    setDashboard,
    showErrorToast,
    showInfoToast,
    showSuccessToast,
  } = useAdminPageContext()
  const [confirmState, setConfirmState] = useState<ConfirmationState>(null)
  const [isWhitelistEditorOpen, setIsWhitelistEditorOpen] = useState(false)
  const [whitelistNickname, setWhitelistNickname] = useState('')
  const [isSavingWhitelist, setIsSavingWhitelist] = useState(false)

  function requestConfirmation(nextState: ConfirmationState) {
    setConfirmState(nextState)
  }

  async function handleCreateWhitelistEntry() {
    if (!isSessionAdmin) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    if (!whitelistNickname.trim()) {
      showInfoToast('Введите никнейм игрока')
      return
    }

    setIsSavingWhitelist(true)

    try {
      const entry = await createAdminWhitelistEntry(whitelistNickname.trim())

      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              whitelist: [
                entry,
                ...prev.whitelist.filter(
                  (item) =>
                    item.nickname.toLowerCase() !==
                    entry.nickname.toLowerCase(),
                ),
              ],
            }
          : prev,
      )
      setWhitelistNickname('')
      setIsWhitelistEditorOpen(false)
      showSuccessToast('Игрок добавлен в whitelist', entry.nickname)
    } catch (requestError) {
      showErrorToast(
        'Не удалось добавить игрока в whitelist',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingWhitelist(false)
    }
  }

  async function handleDeleteWhitelistEntry(entry: AdminWhitelistRow) {
    if (!isSessionAdmin) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    try {
      await deleteAdminWhitelistEntry(entry.nickname)
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              whitelist: prev.whitelist.filter(
                (item) => item.nickname !== entry.nickname,
              ),
            }
          : prev,
      )
      showSuccessToast('Запись удалена из whitelist', entry.nickname)
    } catch (requestError) {
      showErrorToast(
        'Не удалось удалить игрока из whitelist',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  return (
    <>
      <WhitelistSection
        whitelist={dashboard?.whitelist ?? []}
        onOpenCreate={() => setIsWhitelistEditorOpen(true)}
        requestConfirmation={requestConfirmation}
        handleDeleteWhitelistEntry={handleDeleteWhitelistEntry}
      />

      <WhitelistEditorModal
        isOpen={isWhitelistEditorOpen}
        nickname={whitelistNickname}
        isSaving={isSavingWhitelist}
        onOpenChange={(isOpen) => {
          setIsWhitelistEditorOpen(isOpen)
          if (!isOpen) {
            setWhitelistNickname('')
          }
        }}
        onNicknameChange={setWhitelistNickname}
        onSubmit={() => void handleCreateWhitelistEntry()}
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
