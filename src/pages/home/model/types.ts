export type LandingCardTone = 'green' | 'violet' | 'gold' | 'blue' | 'orange'

export type LandingInfoCard = {
  title: string
  text: string
  tone: LandingCardTone
}

export type LandingFeature = {
  title: string
  text: string
  tone: Extract<LandingCardTone, 'violet' | 'blue'>
}
