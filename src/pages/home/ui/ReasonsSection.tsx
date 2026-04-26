import { motion } from 'motion/react'
import type { TargetAndTransition } from 'motion/react'
import { features, reasons } from '../model/homeContent'
import { cardReveal, staggerReveal, viewportReveal } from '@/shared/lib/animation/landingReveal'
import { LandingCard } from '@/shared/ui/landing-card'
import { LandingSection } from '@/shared/ui/landing-section'

type ReasonsSectionProps = {
  revealInitial: false | 'hidden'
  cardHover?: TargetAndTransition
}

export function ReasonsSection({ revealInitial, cardHover }: ReasonsSectionProps) {
  return (
    <LandingSection
      id="reasons"
      tone="green"
      title="Почему мы"
      mark="И почему здесь хочется остаться"
      titleClassName="tycoon-color-lime"
      markClassName="tycoon-color-yellowgreen"
      iconSrc="/assets/img/general/section-green-heading-icon.svg"
      revealInitial={revealInitial}
      withEffect
    >
      <motion.div
        className="xk-card-grid mt-50"
        variants={staggerReveal}
        initial={revealInitial}
        whileInView="show"
        viewport={viewportReveal}
      >
        {reasons.map((reason) => (
          <LandingCard
            key={reason.title}
            title={reason.title}
            tone={reason.tone}
            className={`position-relative xk-info-card _${reason.tone}`}
            contentClassName="xk-info-card__content"
            infoClassName="xk-info-card__text"
            variants={cardReveal}
            whileHover={cardHover}
          >
            {reason.text}
          </LandingCard>
        ))}
      </motion.div>

      <motion.div
        className="xk-feature-grid mt-75"
        variants={staggerReveal}
        initial={revealInitial}
        whileInView="show"
        viewport={viewportReveal}
      >
        {features.map((feature) => (
          <LandingCard
            key={feature.title}
            title={feature.title}
            tone={feature.tone}
            contentClassName="xk-simple-feature"
            infoClassName="mt-50"
            variants={cardReveal}
            whileHover={cardHover}
          >
            {feature.text}
          </LandingCard>
        ))}
      </motion.div>
    </LandingSection>
  )
}
