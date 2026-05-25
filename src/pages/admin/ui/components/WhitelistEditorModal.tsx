import { Button, Modal, Spinner, Text } from '@heroui/react'
import { LabeledInput } from './LabeledInput'

type WhitelistEditorModalProps = {
  isOpen: boolean
  nickname: string
  isSaving: boolean
  onOpenChange: (isOpen: boolean) => void
  onNicknameChange: (value: string) => void
  onSubmit: () => void
}

export function WhitelistEditorModal({
  isOpen,
  nickname,
  isSaving,
  onOpenChange,
  onNicknameChange,
  onSubmit,
}: WhitelistEditorModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-[460px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Добавить игрока в whitelist</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="grid gap-4">
            <Text color="muted" type="body-sm">
              Укажите игровой ник. Запись будет добавлена вручную и сразу
              активирована.
            </Text>
            <LabeledInput
              label="Никнейм"
              placeholder="Steve_2026"
              value={nickname}
              onChange={(event) => onNicknameChange(event.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onPress={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button isDisabled={isSaving} onPress={onSubmit}>
              {isSaving ? <Spinner color="current" size="sm" /> : 'Добавить'}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
