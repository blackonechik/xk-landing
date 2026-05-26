import type { QuickSection } from './profile-status.types'
import { QuickSectionBankIcon } from '../ui/quick-section-icons/QuickSectionBankIcon'
import { QuickSectionFlagIcon } from '../ui/quick-section-icons/QuickSectionFlagIcon'
import { QuickSectionRulesIcon } from '../ui/quick-section-icons/QuickSectionRulesIcon'

export const PROFILE_QUICK_SECTIONS: readonly QuickSection[] = [
  {
    description: 'Объединяйтесь в страны, города, королевства и развивайте их.',
    gradient: 'linear-gradient(180deg, #3e4957 0%, #34424a 100%)',
    icon: <QuickSectionFlagIcon />,
    imageSrc: '/assets/img/profile/players/maxim.webp',
    imageClassName: 'max-w-[45%] left-[-18px]',
    isComingSoon: true,
    textClassName: 'min-[1821px]:max-w-[270px]',
    title: 'Королевства',
  },
  {
    description: 'Переводы, карты и управление игровой валютой в одном месте.',
    gradient: 'linear-gradient(180deg, #55453b 0%, #502721 100%)',
    icon: <QuickSectionBankIcon />,
    imageSrc: '/assets/img/profile/players/forid.webp',
    imageClassName: 'max-w-[40%] left-[-20px]',
    isComingSoon: true,
    requiresBankNavigation: true,
    textClassName: 'min-[1821px]:max-w-[270px]',
    title: 'Банк',
  },
  {
    description: 'Открой актуальные правила, ограничения и уточнения.',
    gradient: 'linear-gradient(180deg, #474e44 0%, #323933 100%)',
    href: '/rules',
    icon: <QuickSectionRulesIcon />,
    imageSrc: '/assets/img/profile/players/xlebkins.webp',
    imageClassName: 'max-w-[60%] left-[-7px] bottom-[-15px] scale-[1.16]',
    textClassName: 'min-[1821px]:max-w-[340px]',
    title: 'Правила',
  },
]
