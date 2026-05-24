import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Card, Chip } from '@heroui/react'
import {
  Circle,
  Gem,
  HeartPulse,
  Radio,
  ScrollText,
} from 'lucide-react'
import AnimatedLink from '@/components/AnimatedLink'
import type { PublicPlayerProfile } from '@/entities/player'
import { formatPlayedHours } from '@/entities/player'
import { fetchSiteSettingsCached, type SiteSettings } from '@/entities/site'
import { formatLastSeen } from '@/shared/lib/date/format-date'
import { HeroMetricCard } from '@/shared/ui/hero-page'

type ProfileStatusPanelProps = {
  player: PublicPlayerProfile
  actions?: ReactNode
  isOwnProfile?: boolean
  totalDiamonds?: number
}

type QuickSectionCardProps = {
  cardClassName?: string
  description: string
  gradient: string
  href?: string
  icon: ReactNode
  imageSrc: string
  imageClassName?: string
  textClassName?: string
  title: string
}

type QuickSection = QuickSectionCardProps & {
  title: string
}

function QuickSectionArrowIcon() {
  return (
    <svg
      aria-hidden
      fill="none"
      height="35"
      viewBox="0 0 35 35"
      width="35"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.29163 17.5H27.7083M17.5 27.7083L27.7083 17.5L17.5 7.29167"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

function QuickSectionFlagIcon() {
  return (
    <svg
      aria-hidden
      fill="none"
      height="43"
      viewBox="0 0 43 43"
      width="43"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.16669 26.875C7.16669 26.875 8.95835 25.0833 14.3334 25.0833C19.7084 25.0833 23.2917 28.6667 28.6667 28.6667C34.0417 28.6667 35.8334 26.875 35.8334 26.875V5.375C35.8334 5.375 34.0417 7.16667 28.6667 7.16667C23.2917 7.16667 19.7084 3.58333 14.3334 3.58333C8.95835 3.58333 7.16669 5.375 7.16669 5.375V26.875ZM7.16669 26.875V39.4167"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
    </svg>
  )
}

function QuickSectionBankIcon() {
  return (
    <svg
      aria-hidden
      fill="none"
      height="48"
      viewBox="0 0 48 48"
      width="48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 2V46M34 10H19C17.1435 10 15.363 10.7375 14.0503 12.0503C12.7375 13.363 12 15.1435 12 17C12 18.8565 12.7375 20.637 14.0503 21.9497C15.363 23.2625 17.1435 24 19 24H29C30.8565 24 32.637 24.7375 33.9497 26.0503C35.2625 27.363 36 29.1435 36 31C36 32.8565 35.2625 34.637 33.9497 35.9497C32.637 37.2625 30.8565 38 29 38H12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

function QuickSectionRulesIcon() {
  return (
    <svg
      aria-hidden
      fill="none"
      height="42"
      viewBox="0 0 42 42"
      width="42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35 14L24.5 3.5H10.5C9.57174 3.5 8.6815 3.86875 8.02513 4.52513C7.36875 5.1815 7 6.07174 7 7V35C7 35.9283 7.36875 36.8185 8.02513 37.4749C8.6815 38.1313 9.57174 38.5 10.5 38.5H31.5C32.4283 38.5 33.3185 38.1313 33.9749 37.4749C34.6313 36.8185 35 35.9283 35 35V14ZM24.5 3.5V14H35M28 22.75H14M28 29.75H14M17.5 15.75H14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

function QuickSectionCard({
  cardClassName,
  description,
  gradient,
  href,
  icon,
  imageSrc,
  imageClassName,
  textClassName,
  title,
}: QuickSectionCardProps) {
  const content = (
    <div
      className={[
        'relative h-[310px] w-full overflow-hidden rounded-2xl',
        href ? 'cursor-pointer' : '',
        cardClassName,
      ].filter(Boolean).join(' ')}
      style={{ backgroundImage: gradient }}
    >
      <img
        alt=""
        aria-hidden
        className={[
          'pointer-events-none absolute bottom-0 right-0 z-0 h-full w-auto object-contain object-bottom-right',
          imageClassName,
        ].filter(Boolean).join(' ')}
        src={imageSrc}
      />

      <div className="relative z-10 flex h-full flex-col p-6">
        <div
          className="text-[#fdfcfc]"
          style={{ filter: 'drop-shadow(-2px 1px 0px #2d3935)' }}
        >
          {icon}
        </div>

        <div
          className={[
            'mt-[22px] grid gap-2',
            textClassName,
          ].filter(Boolean).join(' ')}
          style={{ filter: 'drop-shadow(-2px 1px 0px #2d3935)' }}
        >
          <p className="text-5xl font-bold leading-none text-left text-[#fdfcfc]">
            {title}
          </p>
          <p className="text-base font-semibold leading-5 text-left text-[#757575]">
            {description}
          </p>
        </div>

        <div className="mt-auto flex justify-end text-[#fdfcfc]">
          <QuickSectionArrowIcon />
        </div>
      </div>
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <AnimatedLink className="block h-full w-full" to={href}>
      {content}
    </AnimatedLink>
  )
}

export function ProfileStatusPanel({
  actions,
  isOwnProfile = false,
  player,
  totalDiamonds,
}: ProfileStatusPanelProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

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
          setSettings({ navigation: { showBank: true } })
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  const sections: QuickSection[] = [
    {
      cardClassName: 'xl:col-start-1 xl:row-start-1 xl:w-[613px]',
      description: 'Объединяйтесь в страны, города, королевства и развивайте их.',
      gradient:
        'linear-gradient(180deg, rgb(152 200 255 / 0.26) 0%, rgb(101 161 194 / 0.26) 100%)',
      icon: <QuickSectionFlagIcon />,
      imageSrc: '/assets/img/profile/players/maxim.png',
      imageClassName: 'max-w-[43%]',
      textClassName: 'max-w-[353px]',
      title: 'Королевства',
    },
    ...(settings?.navigation.showBank === false
      ? []
      : [
          {
            cardClassName: 'xl:col-start-2 xl:row-start-1 xl:w-[613px]',
            description: 'Переводы, карты и управление игровой валютой в одном месте.',
            gradient:
              'linear-gradient(180deg, rgb(255 186 152 / 0.26) 0%, rgb(237 46 24 / 0.26) 100%)',
            href: '/cabinet/bank',
            icon: <QuickSectionBankIcon />,
            imageSrc: '/assets/img/profile/players/forid.png',
            imageClassName: 'max-w-[43%]',
            textClassName: 'max-w-[353px]',
            title: 'Банк',
          },
        ]),
    {
      cardClassName: 'xl:col-start-1 xl:row-start-2 xl:w-[500px]',
      description: 'Открой актуальные правила, ограничения и уточнения.',
      gradient:
        'linear-gradient(180deg, rgb(187 221 181 / 0.26) 0%, rgb(109 131 108 / 0.26) 100%)',
      href: '/rules',
      icon: <QuickSectionRulesIcon />,
      imageSrc: '/assets/img/profile/players/xlebkins.png',
      imageClassName: 'max-w-[46%]',
      textClassName: 'max-w-[253px]',
      title: 'Правила',
    },
  ] as QuickSection[]

  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {player.isOnline ?
              <Chip color="success">
                <Circle width={6} fill="currentColor" strokeWidth={0} size={16} />
                <Chip.Label>Онлайн</Chip.Label>
              </Chip>
              :
              <Chip color="danger">
                <Circle width={6} fill="currentColor" strokeWidth={0} size={16} />
                <Chip.Label>Оффлайн</Chip.Label>
              </Chip>}
            <Card.Title className='text-lg'>{player.nickname}</Card.Title>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </Card.Header>
      <Card.Content className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <HeroMetricCard
            label="Жизни"
            value={player.lives ?? 'нет данных'}
            icon={<HeartPulse size={18} />}
          />
          <HeroMetricCard
            label="Последний вход"
            value={formatLastSeen(player.lastLoginAt)}
            icon={<ScrollText size={18} />}
          />
          <HeroMetricCard
            label="Наиграно"
            value={formatPlayedHours(player.playedHours)}
            icon={<Radio size={18} />}
          />
          {typeof totalDiamonds === 'number' ? (
            <HeroMetricCard
              label="Алмазы"
              value={totalDiamonds}
              icon={<Gem size={18} />}
            />
          ) : null}
        </div>

        {isOwnProfile ? (
          <>
            <Card.Title>Быстрые разделы:</Card.Title>

            <div className="grid gap-4 xl:grid-cols-[613px_613px] xl:grid-rows-[310px_310px] xl:gap-6">
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
                  textClassName={section.textClassName}
                  title={section.title}
                />
              ))}
            </div>
          </>
        ) : null}
      </Card.Content>
    </Card>
  )
}
