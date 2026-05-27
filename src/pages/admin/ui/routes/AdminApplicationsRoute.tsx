import { useState } from 'react'
import { AdminConfirmationDialog } from '../components/AdminConfirmationDialog'
import { ApplicationsSection } from '../sections/ApplicationsSection'
import { updateAdminApplication } from '../../model/api'
import type { AdminApplicationRow } from '../../model/api'
import type { ConfirmationState } from '../../model/types'
import { useAdminPageContext } from '../../model/admin-page-context'

export function AdminApplicationsRoute() {
  const {
    account,
    dashboard,
    isSessionAdmin,
    setDashboard,
    showErrorToast,
    showSuccessToast,
  } = useAdminPageContext()
  const [applicationNotes, setApplicationNotes] = useState<
    Record<string, string>
  >({})
  const [confirmState, setConfirmState] = useState<ConfirmationState>(null)

  function requestConfirmation(nextState: ConfirmationState) {
    setConfirmState(nextState)
  }

  async function handleUpdateApplication(
    application: AdminApplicationRow,
    status: string,
  ) {
    if (!isSessionAdmin || !account) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    try {
      const updated = await updateAdminApplication(application.id, {
        status,
        reviewNote:
          Object.hasOwn(applicationNotes, application.id)
            ? applicationNotes[application.id]
            : application.reviewNote,
        reviewedBy: account.player.nickname,
      })

      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              applications: prev.applications.map((item) =>
                item.id === updated.id ? updated : item,
              ),
            }
          : prev,
      )
      showSuccessToast(
        'Статус заявки обновлен',
        `${application.nickname}: ${updated.status}.`,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить заявку',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  return (
    <>
      <ApplicationsSection
        applications={dashboard?.applications ?? []}
        applicationNotes={applicationNotes}
        setApplicationNotes={setApplicationNotes}
        requestConfirmation={requestConfirmation}
        handleUpdateApplication={handleUpdateApplication}
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
