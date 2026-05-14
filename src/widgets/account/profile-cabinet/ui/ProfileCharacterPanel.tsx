import {
  Button,
  Card,
  ColorSwatchPicker,
  Label,
  ListBox,
  Modal,
  Select,
  Text,
} from '@heroui/react'
import { Pencil } from 'lucide-react'
import { SkinViewer } from '@/entities/account'
import {
  defaultProfileAppearance,
  profileAnimations,
  profileBackgrounds,
  type ProfileAppearance,
} from '../model/profile-appearance'

type ProfileCharacterPanelProps = {
  nickname: string
  appearance?: ProfileAppearance
  isEditable?: boolean
  onAppearanceChange?: (appearance: ProfileAppearance) => void
}

export function ProfileCharacterPanel({
  nickname,
  appearance = defaultProfileAppearance,
  isEditable = false,
  onAppearanceChange,
}: ProfileCharacterPanelProps) {
  const selectedBackground =
    profileBackgrounds.find((item) => item.id === appearance.background) ??
    profileBackgrounds[0]

  function updateAppearance(nextAppearance: Partial<ProfileAppearance>) {
    onAppearanceChange?.({
      ...appearance,
      ...nextAppearance,
    })
  }

  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <Card.Title>Персонаж</Card.Title>
          <Card.Description>А кто это у нас такой красивый?</Card.Description>
        </div>
        {isEditable ? (
          <Modal>
            <Button isIconOnly size="sm" variant="secondary" title="Настроить профиль">
              <Pencil size={16} />
            </Button>
            <Modal.Backdrop>
              <Modal.Container placement="auto">
                <Modal.Dialog className="sm:max-w-3xl">
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Heading>Настройка профиля</Modal.Heading>
                    <Text className="mt-2" color="muted" type="body-sm">
                      Выберите анимацию персонажа и фон профиля. Изменения
                      сразу видны в предпросмотре.
                    </Text>
                  </Modal.Header>
                  <Modal.Body className="grid gap-5 p-6 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="grid gap-4">
                      <Select
                        value={appearance.animation}
                        onChange={(value) =>
                          updateAppearance({
                            animation:
                              (value as ProfileAppearance['animation']) ??
                              'inspect',
                          })
                        }
                      >
                        <Label>Анимация</Label>
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {profileAnimations.map((item) => (
                              <ListBox.Item
                                id={item.id}
                                key={item.id}
                                textValue={item.label}
                              >
                                {item.label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>

                      <div className="grid gap-2">
                        <Label>Фон профиля</Label>
                        <ColorSwatchPicker
                          value={selectedBackground.color}
                          onChange={(color) => {
                            const nextBackground = profileBackgrounds.find(
                              (item) =>
                                item.color.toLowerCase() ===
                                String(color).toLowerCase(),
                            )

                            if (nextBackground) {
                              updateAppearance({
                                background: nextBackground.id,
                              })
                            }
                          }}
                        >
                          {profileBackgrounds.map((item) => (
                            <ColorSwatchPicker.Item
                              key={item.id}
                              color={item.color}
                            >
                              <ColorSwatchPicker.Swatch />
                              <ColorSwatchPicker.Indicator />
                            </ColorSwatchPicker.Item>
                          ))}
                        </ColorSwatchPicker>
                        <Text color="muted" type="body-sm">
                          Сейчас выбран: {selectedBackground.label}
                        </Text>
                      </div>
                    </div>

                    <SkinViewer
                      animation={appearance.animation}
                      background={appearance.background}
                      nickname={nickname}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button slot="close">Готово</Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        ) : null}
      </Card.Header>
      <Card.Content>
        <SkinViewer
          animation={appearance.animation}
          background={appearance.background}
          nickname={nickname}
        />
      </Card.Content>
    </Card>
  )
}
