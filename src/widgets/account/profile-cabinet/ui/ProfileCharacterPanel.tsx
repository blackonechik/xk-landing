import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  ColorSwatchPicker,
  Label,
  ListBox,
  Modal,
  Select,
  Text,
  parseColor,
  useOverlayState,
} from '@heroui/react'
import { Pencil } from 'lucide-react'
import { SkinViewer } from '@/entities/account'
import type { PublicPlayerProfile } from '@/entities/player'
import {
  defaultProfileAppearance,
  getProfileBackgroundLabel,
  profileAnimations,
  profilePaletteBackgrounds,
} from '../model/profile-appearance'
import type { ProfileAppearance } from '../model/profile-appearance'
import { ProfileRatingPanel } from './ProfileRatingPanel'

type ProfileCharacterPanelProps = {
  player: PublicPlayerProfile
  nickname: string
  appearance?: ProfileAppearance
  isEditable?: boolean
  isOwnProfile?: boolean
  onAppearanceChange?: (appearance: ProfileAppearance) => void
  onPlayerChange?: (player: PublicPlayerProfile) => void
}

export function ProfileCharacterPanel({
  player,
  nickname,
  appearance = defaultProfileAppearance,
  isEditable = false,
  isOwnProfile = false,
  onAppearanceChange,
  onPlayerChange,
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

  function resolveBackgroundIdByColor(colorValue: string) {
    return profilePaletteBackgrounds.find(
      (item) => parseColor(item.background).toString('hex') === colorValue,
    )?.id
  }

  const gradientPickerValue = profilePaletteBackgrounds.some(
    (item) => item.id === draftAppearance.background,
  )
    ? profilePaletteBackgrounds.find((item) => item.id === draftAppearance.background)?.background
    : profilePaletteBackgrounds[0]?.background

  return (
    <Card className='max-h-max'>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <Card.Title>Персонаж</Card.Title>
          <Card.Description>А кто это у нас такой красивый?</Card.Description>
        </div>
      </Card.Header>
      <Card.Content className='gap-2'>
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
                  aria-label="Настроить профиль"
                  onPress={() => modalState.open()}
                >
                  <Pencil size={16} />
                </Button>
              ) : null
            }
          />
          <ProfileRatingPanel
            isOwnProfile={isOwnProfile}
            onPlayerChange={onPlayerChange}
            player={player}
          />
          <Modal.Backdrop
            isOpen={modalState.isOpen}
            onOpenChange={modalState.setOpen}
          >
            <Modal.Container placement="auto">
              <Modal.Dialog className="font-sans sm:max-w-3xl **:font-sans">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Настройка профиля</Modal.Heading>
                  <Text className="mt-2" color="muted" type="body-sm">
                    Выберите анимацию персонажа и градиент профиля. Анимация проигрывается не постоянно, а периодически, чтобы не перегружать страницу.
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
                      <Label>Градиент профиля</Label>
                      <div className="flex flex-wrap items-center gap-2">
                        <ColorSwatchPicker
                          aria-label="Выбор градиента профиля"
                          className="contents"
                          layout="grid"
                          size="lg"
                          value={gradientPickerValue ? parseColor(gradientPickerValue) : undefined}
                          onChange={(color) => {
                            const nextBackground = resolveBackgroundIdByColor(color.toString('hex'))

                            if (nextBackground) {
                              updateDraftAppearance({
                                background: nextBackground,
                              })
                            }
                          }}
                        >
                          {profilePaletteBackgrounds.map((item) => (
                            <ColorSwatchPicker.Item
                              key={item.id}
                              color={item.background}
                            >
                              <ColorSwatchPicker.Swatch />
                              <ColorSwatchPicker.Indicator />
                            </ColorSwatchPicker.Item>
                          ))}
                        </ColorSwatchPicker>
                      </div>
                      <Text color="muted" type="body-sm">
                        {getProfileBackgroundLabel(draftAppearance.background)}
                      </Text>
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
      </Card.Content>
    </Card>
  )
}
