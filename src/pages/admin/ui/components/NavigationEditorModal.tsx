import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  Spinner,
  Text,
} from '@heroui/react'
import type { SiteNavigationIconKey, SiteNavigationRole } from '@/entities/site'
import { navigationIconOptions } from '@/widgets/account/sidebar/model/account-sidebar-menu'
import { navigationRoleOptions } from '../../model/constants'
import type { NavigationEditorState } from '../../model/types'
import { LabeledInput } from './LabeledInput'

type NavigationEditorModalProps = {
  navigationEditor: NavigationEditorState
  isSavingSettings: boolean
  onOpenChange: (isOpen: boolean) => void
  onLabelChange: (value: string) => void
  onIconChange: (icon: SiteNavigationIconKey) => void
  onAudiencesChange: (roles: SiteNavigationRole[]) => void
  onSubmit: () => void
}

export function NavigationEditorModal({
  navigationEditor,
  isSavingSettings,
  onOpenChange,
  onLabelChange,
  onIconChange,
  onAudiencesChange,
  onSubmit,
}: NavigationEditorModalProps) {
  return (
    <Modal.Backdrop
      isOpen={Boolean(navigationEditor)}
      onOpenChange={onOpenChange}
    >
      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-2xl">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Редактирование пункта навигации</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="grid gap-5">
            <LabeledInput
              label="Название раздела"
              value={navigationEditor?.label ?? ''}
              onChange={(event) => onLabelChange(event.target.value)}
            />

            <div className="grid gap-3">
              <Text color="muted" type="body-sm">
                Иконка
              </Text>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {navigationIconOptions.map((option) => {
                  const selected = navigationEditor?.icon === option.key

                  return (
                    <Button
                      key={option.key}
                      className="justify-start"
                      variant={selected ? 'secondary' : 'ghost'}
                      onPress={() => onIconChange(option.key)}
                    >
                      <span className="mr-2 inline-flex text-muted">
                        {option.icon}
                      </span>
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-3">
              <Text color="muted" type="body-sm">
                Кому показывать
              </Text>
              <CheckboxGroup
                value={navigationEditor?.audiences ?? []}
                onChange={(value) =>
                  onAudiencesChange(value as SiteNavigationRole[])
                }
              >
                <div className="grid gap-2 sm:grid-cols-3">
                  {navigationRoleOptions.map((option) => (
                    <Checkbox key={option.value} value={option.value}>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>{option.label}</Checkbox.Content>
                    </Checkbox>
                  ))}
                </div>
              </CheckboxGroup>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="secondary">
              Отмена
            </Button>
            <Button isDisabled={isSavingSettings} onPress={onSubmit}>
              {isSavingSettings ? (
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
