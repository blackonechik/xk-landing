import type { TargetAndTransition } from 'motion/react'
import { applyContent } from '../model/homeContent'
import { cardReveal, viewportReveal } from '@/shared/lib/animation/landingReveal'
import { LandingButton } from '@/shared/ui/landing-button'
import { LandingCard } from '@/shared/ui/landing-card'
import { LandingSection } from '@/shared/ui/landing-section'

type ApplySectionProps = {
  revealInitial: false | 'hidden'
  cardHover?: TargetAndTransition
}

export function ApplySection({ revealInitial, cardHover }: ApplySectionProps) {
  return (
    <LandingSection
      id="apply"
      tone="brown"
      title={applyContent.title}
      mark={applyContent.mark}
      titleClassName="tycoon-color-yellow"
      markClassName="tycoon-color-orange-2"
      iconSrc="/assets/img/general/section-brown-heading-icon.svg"
      revealInitial={revealInitial}
      withEffect
      withEnding
    >
      <LandingCard
        title={applyContent.badge}
        contentClassName="xk-cta-content"
        infoClassName="mt-50"
        variants={cardReveal}
        initial={revealInitial}
        whileInView="show"
        viewport={viewportReveal}
        whileHover={cardHover}
      >
        Если тебе нужен приватный Minecraft сервер с
        <span className="tycoon-landing-feature__info-mark-1"> живой историей</span>,
        союзниками, городами, королевствами и
        <span className="tycoon-landing-feature__info-mark-2"> важными решениями</span>, тебе
        сюда.
        <div className="xk-cta-actions">
          <LandingButton
            href="#"
            tone="primary"
            className="xk-cta-actions__telegram"
            contentClassName="text-40"
            arrowTone="primary"
            arrow
          >
            {applyContent.telegramLabel}
          </LandingButton>
          <LandingButton
            href="/payment"
            tone="success"
            className="xk-cta-actions__buy"
            contentClassName="text-40"
            arrow
          >
            {applyContent.buyPassLabel}
          </LandingButton>
        </div>
      </LandingCard>
    </LandingSection>
  )
}
