import { useEffect, useState } from 'react'
import { Button, Card, Chip, Modal, Text } from '@heroui/react'
import {
  Circle,
  Gem,
  HeartPulse,
  Radio,
  Rocket,
  ScrollText,
} from 'lucide-react'
import { getPrimaryRoleLabel, isAdminRole } from '@/entities/account'
import { formatPlayedHours } from '@/entities/player'
import { fetchSiteSettingsCached } from '@/entities/site'
import type { SiteSettings } from '@/entities/site'
import { formatLastSeen } from '@/shared/lib/date/format-date'
import { HeroSectionCard } from '@/shared/ui/hero-page'
import { PROFILE_QUICK_SECTIONS } from '../model/quick-sections'
import type { ProfileStatusPanelProps } from '../model/profile-status.types'
import { QuickSectionCard } from './QuickSectionCard'

export function ProfileStatusPanel({
  actions,
  isOwnProfile = false,
  player,
  totalDiamonds,
}: ProfileStatusPanelProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [comingSoonSection, setComingSoonSection] = useState<string | null>(
    null,
  )

  useEffect(() => {
    let isActive = true

    void fetchSiteSettingsCached()
      .then((payload) => {
        if (isActive) {
          setSettings(payload)
        }
      })
      .catch(() => {
        if (isActive) {
          setSettings({ navigation: { showBank: true, items: [] } })
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  const sections = PROFILE_QUICK_SECTIONS.filter(
    (section) =>
      !section.requiresBankNavigation ||
      settings?.navigation.showBank !== false,
  )

  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {player.isOnline ? (
              <Chip color="success">
                <Circle
                  width={6}
                  fill="currentColor"
                  strokeWidth={0}
                  size={16}
                />
                <Chip.Label>Онлайн</Chip.Label>
              </Chip>
            ) : (
              <Chip color="danger">
                <Circle
                  width={6}
                  fill="currentColor"
                  strokeWidth={0}
                  size={16}
                />
                <Chip.Label>Оффлайн</Chip.Label>
              </Chip>
            )}
            <Chip
              color={isAdminRole(player.roles) ? 'accent' : 'default'}
              variant="soft"
            >
              {getPrimaryRoleLabel(player.roles)}
            </Chip>
            <Card.Title className="text-lg">{player.nickname}</Card.Title>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </Card.Header>
      <Card.Content className="grid gap-5">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          <HeroSectionCard
            gradient="rose"
            label="Жизни:"
            value={player.lives ?? 'нет данных'}
            icon={<HeartPulse size={40} />}
          />
          <HeroSectionCard
            gradient="sky"
            label="Последний вход:"
            value={formatLastSeen(player.lastLoginAt)}
            icon={<ScrollText size={40} />}
          />
          <HeroSectionCard
            gradient="aqua"
            label="Наиграно"
            value={formatPlayedHours(player.playedHours)}
            icon={<Radio size={40} />}
          />
          {typeof totalDiamonds === 'number' ? (
            <HeroSectionCard
              gradient="lime"
              label="Алмазы:"
              value={totalDiamonds}
              icon={<Gem size={40} />}
            />
          ) : null}
        </div>

        {isOwnProfile ? (
          <>
            <Card.Title>Быстрые разделы:</Card.Title>

            <div className="grid grid-cols-2 gap-4 max-[1820px]:grid-cols-1 xl:gap-6">
              {sections.map((section) => (
                <QuickSectionCard
                  key={section.title}
                  cardClassName={section.cardClassName}
                  description={section.description}
                  gradient={section.gradient}
                  href={section.href}
                  icon={section.icon}
                  imageSrc={section.imageSrc}
                  imageClassName={section.imageClassName}
                  onPress={
                    section.isComingSoon
                      ? () => setComingSoonSection(section.title)
                      : undefined
                  }
                  textClassName={section.textClassName}
                  title={section.title}
                />
              ))}
            </div>
          </>
        ) : null}

        <Modal.Backdrop
          isOpen={Boolean(comingSoonSection)}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setComingSoonSection(null)
            }
          }}
        >
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-[420px]">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Icon className="bg-default text-foreground">
                  <Rocket className="size-5" />
                </Modal.Icon>
                <Modal.Heading>{comingSoonSection}</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p>Этот раздел в разработке.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={() => setComingSoonSection(null)}>
                  Понятно
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Card.Content>
    </Card>
  )
}
