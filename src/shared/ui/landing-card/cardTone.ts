import type { LandingCardTone } from '@/pages/home/model/types'

export function getCardToneClass(tone: LandingCardTone) {
  if (tone === 'orange') {
    return ''
  }

  return `tycoon-landing-card_style-${tone}`
}

export function getBadgeToneClass(tone: LandingCardTone) {
  if (tone === 'gold' || tone === 'orange') {
    return 'tycoon-landing-feature__badge_style-orange'
  }

  return `tycoon-landing-feature__badge_style-${tone}`
}

export function getInfoToneClass(tone: LandingCardTone) {
  if (tone === 'gold' || tone === 'orange') {
    return 'tycoon-landing-feature__info_style-orange'
  }

  return `tycoon-landing-feature__info_style-${tone}`
}
