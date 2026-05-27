import { useState } from 'react'
import { clearSiteSettingsCache } from '@/entities/site'
import type { SiteNavigationItem, SiteNavigationRole } from '@/entities/site'
import { AdminConfirmationDialog } from '../components/AdminConfirmationDialog'
import { NavigationEditorModal } from '../components/NavigationEditorModal'
import { NavigationSection } from '../sections/NavigationSection'
import { updateAdminNavigation } from '../../model/api'
import type {
  ConfirmationState,
  NavigationEditorState,
} from '../../model/types'
import { useAdminPageContext } from '../../model/admin-page-context'

export function AdminNavigationRoute() {
  const {
    isSessionAdmin,
    navigationItems,
    setDashboard,
    showErrorToast,
    showInfoToast,
    showSuccessToast,
  } = useAdminPageContext()
  const [confirmState, setConfirmState] = useState<ConfirmationState>(null)
  const [navigationEditor, setNavigationEditor] =
    useState<NavigationEditorState>(null)
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  function requestConfirmation(nextState: ConfirmationState) {
    setConfirmState(nextState)
  }

  async function handleSaveNavigation(
    items: SiteNavigationItem[],
    successMessage: string,
    description?: string,
  ) {
    if (!isSessionAdmin) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    setIsSavingSettings(true)

    try {
      const settings = await updateAdminNavigation(items)
      clearSiteSettingsCache()
      setDashboard((prev) => (prev ? { ...prev, settings } : prev))
      showSuccessToast(successMessage, description)
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить навигацию',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingSettings(false)
    }
  }

  function openNavigationEditor(item: SiteNavigationItem) {
    setNavigationEditor({
      key: item.key,
      label: item.label,
      icon: item.icon,
      audiences: [...item.audiences],
    })
  }

  async function handleSaveNavigationEditor() {
    if (!navigationEditor) {
      return
    }

    if (!navigationEditor.label.trim()) {
      showInfoToast('Укажите название раздела')
      return
    }

    if (navigationEditor.audiences.length === 0) {
      showInfoToast('Выберите хотя бы одну группу игроков')
      return
    }

    const nextItems = navigationItems.map((item) =>
      item.key === navigationEditor.key
        ? {
            ...item,
            label: navigationEditor.label.trim(),
            icon: navigationEditor.icon,
            audiences: [...navigationEditor.audiences],
            deleted: false,
          }
        : item,
    )

    await handleSaveNavigation(
      nextItems,
      'Навигация обновлена',
      `Раздел ${navigationEditor.label.trim()} сохранен.`,
    )
    setNavigationEditor(null)
  }

  return (
    <>
      <NavigationSection
        navigationItems={navigationItems}
        isSavingSettings={isSavingSettings}
        openNavigationEditor={openNavigationEditor}
        requestConfirmation={requestConfirmation}
        handleSaveNavigation={handleSaveNavigation}
      />

      <NavigationEditorModal
        navigationEditor={navigationEditor}
        isSavingSettings={isSavingSettings}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setNavigationEditor(null)
          }
        }}
        onLabelChange={(value) =>
          setNavigationEditor((prev) =>
            prev
              ? {
                  ...prev,
                  label: value,
                }
              : prev,
          )
        }
        onIconChange={(icon) =>
          setNavigationEditor((prev) =>
            prev
              ? {
                  ...prev,
                  icon,
                }
              : prev,
          )
        }
        onAudiencesChange={(roles) =>
          setNavigationEditor((prev) =>
            prev
              ? {
                  ...prev,
                  audiences: roles,
                }
              : prev,
          )
        }
        onSubmit={() => void handleSaveNavigationEditor()}
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
