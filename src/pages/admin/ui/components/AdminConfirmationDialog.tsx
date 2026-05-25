import { AlertDialog, Button } from '@heroui/react'
import { getButtonToneClass } from '../../lib/getButtonToneClass'
import type { ConfirmationState } from '../../model/types'

type AdminConfirmationDialogProps = {
  confirmState: ConfirmationState
  onOpenChange: (isOpen: boolean) => void
}

export function AdminConfirmationDialog({
  confirmState,
  onOpenChange,
}: AdminConfirmationDialogProps) {
  return (
    <AlertDialog.Backdrop
      isOpen={Boolean(confirmState)}
      onOpenChange={onOpenChange}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-[440px]">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon
              status={
                confirmState?.confirmColor === 'danger' ? 'danger' : 'accent'
              }
            />
            <AlertDialog.Heading>
              {confirmState?.title ?? 'Подтверждение действия'}
            </AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p>{confirmState?.description ?? ''}</p>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button slot="close" variant="tertiary">
              Отмена
            </Button>
            <Button
              className={getButtonToneClass(
                confirmState?.confirmColor ?? 'default',
              )}
              slot="close"
              onPress={async () => {
                const nextConfirmState = confirmState

                if (!nextConfirmState) {
                  return
                }

                await nextConfirmState.onConfirm()
              }}
            >
              {confirmState?.confirmLabel ?? 'Подтвердить'}
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  )
}
