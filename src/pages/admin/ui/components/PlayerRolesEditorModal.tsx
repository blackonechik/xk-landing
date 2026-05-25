import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  Spinner,
  Text,
} from '@heroui/react'
import type { PlayerRolesEditorState } from '../../model/types'

type PlayerRolesEditorModalProps = {
  playerRolesEditor: PlayerRolesEditorState
  isSavingPlayerRoles: boolean
  playerRoleOptions: { value: string; label: string }[]
  onOpenChange: (isOpen: boolean) => void
  onRolesChange: (roles: string[]) => void
  onSubmit: () => void
}

export function PlayerRolesEditorModal({
  playerRolesEditor,
  isSavingPlayerRoles,
  playerRoleOptions,
  onOpenChange,
  onRolesChange,
  onSubmit,
}: PlayerRolesEditorModalProps) {
  return (
    <Modal.Backdrop
      isOpen={Boolean(playerRolesEditor)}
      onOpenChange={onOpenChange}
    >
      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-[480px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>
              Роли пользователя {playerRolesEditor?.player.nickname ?? ''}
            </Modal.Heading>
          </Modal.Header>
          <Modal.Body className="grid gap-4">
            <Text color="muted" type="body-sm">
              Роль игрока сохраняется всегда. Дополнительно можно назначить
              права модератора или администратора.
            </Text>
            <CheckboxGroup
              value={playerRolesEditor?.roles ?? ['player']}
              onChange={onRolesChange}
            >
              <div className="grid gap-2">
                {playerRoleOptions.map((option) => (
                  <Checkbox
                    key={option.value}
                    isDisabled={option.value === 'player'}
                    value={option.value}
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content>{option.label}</Checkbox.Content>
                  </Checkbox>
                ))}
              </div>
            </CheckboxGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onPress={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button isDisabled={isSavingPlayerRoles} onPress={onSubmit}>
              {isSavingPlayerRoles ? (
                <Spinner color="current" size="sm" />
              ) : (
                'Сохранить'
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
