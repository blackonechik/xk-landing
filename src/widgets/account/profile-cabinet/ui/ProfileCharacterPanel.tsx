import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Label,
  ListBox,
  Modal,
  Select,
  Text,
  useOverlayState,
} from '@heroui/react'
import { Pencil } from 'lucide-react'
import { SkinViewer } from '@/entities/account'
import {
  defaultProfileAppearance,
  profileAnimations,
  profilePaletteBackgrounds,
  profilePanoramaBackgrounds,
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
  const modalState = useOverlayState()
  const [draftAppearance, setDraftAppearance] =
    useState<ProfileAppearance>(appearance)

  useEffect(() => {
    if (modalState.isOpen) {
      setDraftAppearance(appearance)
    }
  }, [appearance, modalState.isOpen])

  function updateDraftAppearance(nextAppearance: Partial<ProfileAppearance>) {
    setDraftAppearance((current) => ({
      ...current,
      ...nextAppearance,
    }))
  }

  function saveAppearance() {
    onAppearanceChange?.(draftAppearance)
    modalState.close()
  }

  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <Card.Title>Персонаж</Card.Title>
          <Card.Description>А кто это у нас такой красивый?</Card.Description>
        </div>
      </Card.Header>
      <Card.Content>
        <>
          <SkinViewer
            animation={appearance.animation}
            background={appearance.background}
            nickname={nickname}
            topRightAction={
              isEditable ? (
                <Button
                  isIconOnly
                  size="sm"
                  variant="secondary"
                  title="Настроить профиль"
                  onPress={() => modalState.open()}
                >
                  <Pencil size={16} />
                </Button>
              ) : null
            }
          />
          <Modal.Backdrop
            isOpen={modalState.isOpen}
            onOpenChange={modalState.setOpen}
          >
            <Modal.Container placement="auto">
              <Modal.Dialog className="font-sans sm:max-w-3xl [&_*]:font-sans">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Настройка профиля</Modal.Heading>
                  <Text className="mt-2" color="muted" type="body-sm">
                    Выберите анимацию персонажа и фон профиля. Таким будет видеть ваш профиль другие игроки.
                  </Text>
                </Modal.Header>
                <Modal.Body className="grid gap-5 p-6 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="flex flex-col gap-5">
                    <Select
                      selectedKey={draftAppearance.animation}
                      onSelectionChange={(key) => {
                        if (typeof key === 'string') {
                          updateDraftAppearance({
                            animation: key as ProfileAppearance['animation'],
                          })
                        }
                      }}
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

                    <div className="grid gap-3">
                      <Label>Палитра профиля</Label>
                      <div className="flex flex-wrap gap-2">
                        {profilePaletteBackgrounds.map((item) => (
                          <button
                            key={item.id}
                            className={[
                              'size-9 rounded-full border transition hover:scale-105',
                              item.swatch,
                              draftAppearance.background === item.id
                                ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/35'
                                : 'border-[var(--separator)] hover:border-[var(--accent)]/70',
                            ].join(' ')}
                            title={item.label}
                            type="button"
                            onClick={() =>
                              updateDraftAppearance({
                                background: item.id,
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Label>3D-фон</Label>
                      <div className="flex flex-wrap gap-2">
                        {profilePanoramaBackgrounds.map((item) => (
                          <button
                            key={item.id}
                            className={[
                              'size-9 rounded-full border transition hover:scale-105',
                              item.swatch,
                              draftAppearance.background === item.id
                                ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/35'
                                : 'border-[var(--separator)] hover:border-[var(--accent)]/70',
                            ].join(' ')}
                            title={item.label}
                            type="button"
                            onClick={() =>
                              updateDraftAppearance({
                                background: item.id,
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <SkinViewer
                    animation={draftAppearance.animation}
                    background={draftAppearance.background}
                    nickname={nickname}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="ghost" onPress={() => modalState.close()}>
                    Отмена
                  </Button>
                  <Button onPress={saveAppearance}>Готово</Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </>
      </Card.Content>
    </Card>
  )
}
