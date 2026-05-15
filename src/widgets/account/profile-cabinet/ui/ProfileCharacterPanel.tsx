import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
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
  getProfileBackgroundColor,
  getProfileBackgroundLabel,
  isCustomProfileBackground,
  profileAnimations,
  profilePaletteBackgrounds,
  profilePanoramaBackgrounds,
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

  function resolveBackgroundIdByColor(
    items: typeof profilePaletteBackgrounds | typeof profilePanoramaBackgrounds,
    colorValue: string,
  ) {
    return items.find(
      (item) => parseColor(item.background).toString('hex') === colorValue,
    )?.id
  }

  const palettePickerValue = isCustomProfileBackground(draftAppearance.background)
    ? draftAppearance.background
    : profilePaletteBackgrounds.some(
          (item) => item.id === draftAppearance.background,
        )
      ? getProfileBackgroundColor(draftAppearance.background)
      : undefined

  const panoramaPickerValue = profilePanoramaBackgrounds.some(
    (item) => item.id === draftAppearance.background,
  )
    ? getProfileBackgroundColor(draftAppearance.background)
    : undefined

  const customColorValue = isCustomProfileBackground(draftAppearance.background)
    ? draftAppearance.background
    : getProfileBackgroundColor('palette-slate')
  const isCustomPaletteSelected = isCustomProfileBackground(
    draftAppearance.background,
  )

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
                      <div className="flex flex-wrap items-center gap-2">
                        <ColorSwatchPicker
                          aria-label="Выбор палитры профиля"
                          className="contents"
                          layout="grid"
                          size="lg"
                          value={palettePickerValue ? parseColor(palettePickerValue) : undefined}
                          onChange={(color) => {
                            const nextBackground = resolveBackgroundIdByColor(
                              profilePaletteBackgrounds,
                              color.toString('hex'),
                            )

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

                        <ColorPicker
                          aria-label="Выбор своего цвета профиля"
                          value={parseColor(customColorValue)}
                          onChange={(color) => {
                            updateDraftAppearance({
                              background: color.toString('hex') as ProfileAppearance['background'],
                            })
                          }}
                        >
                          <ColorPicker.Trigger
                            className={[
                              'relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border transition-transform hover:scale-105',
                              isCustomPaletteSelected
                                ? 'border-accent ring-2 ring-(--accent)/35'
                                : 'border-separator hover:border-(--accent)/70',
                            ].join(' ')}
                          >
                            <span
                              aria-hidden
                              className="absolute inset-0"
                              style={{
                                backgroundImage:
                                  'conic-gradient(from 180deg, #ff4d4d, #ff9f1c, #ffe66d, #2ec4b6, #3a86ff, #8338ec, #ff006e, #ff4d4d)',
                              }}
                            />
                            <span
                              aria-hidden
                              className="relative z-1 size-5 rounded-full border border-white/70 shadow-sm"
                              style={{ backgroundColor: customColorValue }}
                            />
                          </ColorPicker.Trigger>
                          <ColorPicker.Popover placement="bottom start">
                            <div className="grid gap-4 p-4">
                              <ColorArea
                                colorSpace="hsb"
                                xChannel="saturation"
                                yChannel="brightness"
                              >
                                <ColorArea.Thumb />
                              </ColorArea>
                              <ColorSlider colorSpace="hsb" channel="hue">
                                <ColorSlider.Track>
                                  <ColorSlider.Thumb />
                                </ColorSlider.Track>
                              </ColorSlider>
                              <ColorField aria-label="HEX цвет профиля">
                                <ColorField.Group>
                                  <ColorField.Input />
                                </ColorField.Group>
                              </ColorField>
                            </div>
                          </ColorPicker.Popover>
                        </ColorPicker>
                      </div>
                      <Text color="muted" type="body-sm">
                        {getProfileBackgroundLabel(draftAppearance.background)}
                      </Text>
                    </div>

                    <div className="grid gap-3">
                      <Label>3D-фон</Label>
                      <ColorSwatchPicker
                        aria-label="Выбор 3D-фона"
                        layout="grid"
                        size="lg"
                        value={panoramaPickerValue ? parseColor(panoramaPickerValue) : undefined}
                        onChange={(color) => {
                          const nextBackground = resolveBackgroundIdByColor(
                            profilePanoramaBackgrounds,
                            color.toString('hex'),
                          )

                          if (nextBackground) {
                            updateDraftAppearance({
                              background: nextBackground,
                            })
                          }
                        }}
                      >
                        {profilePanoramaBackgrounds.map((item) => (
                          <ColorSwatchPicker.Item
                            key={item.id}
                            color={item.background}
                          >
                            <ColorSwatchPicker.Swatch />
                            <ColorSwatchPicker.Indicator />
                          </ColorSwatchPicker.Item>
                        ))}
                      </ColorSwatchPicker>
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
