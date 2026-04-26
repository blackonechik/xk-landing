import { motion } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'
import type { LandingCardTone } from '@/pages/home/model/types'
import { getBadgeToneClass, getCardToneClass, getInfoToneClass } from './cardTone'

type LandingCardProps = Omit<ComponentProps<typeof motion.article>, 'children' | 'title'> & {
  title: string
  children: ReactNode
  tone?: LandingCardTone
  className?: string
  contentClassName?: string
  infoClassName?: string
}

export function LandingCard({
  title,
  children,
  tone = 'orange',
  className,
  contentClassName,
  infoClassName,
  ...props
}: LandingCardProps) {
  return (
    <motion.article
      className={['tycoon-landing-feature', className].filter(Boolean).join(' ')}
      {...props}
    >
      <div className={['tycoon-landing-card', getCardToneClass(tone)].filter(Boolean).join(' ')}>
        <div className="tycoon-landing-card__wrapper">
          <div className="tycoon-landing-card__wrapper-inner">
            <div
              className={['tycoon-landing-card__content', contentClassName]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="tycoon-landing-feature__badge-wrapper">
                <div
                  className={['tycoon-landing-feature__badge', getBadgeToneClass(tone)]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="tycoon-landing-feature__badge-content">{title}</div>
                </div>
              </div>

              <div
                className={[
                  'tycoon-landing-feature__info',
                  getInfoToneClass(tone),
                  infoClassName,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
        <img
          src="/assets/img/general/card-shadow.png"
          className="tycoon-landing-card__shadow"
          alt=""
        />
      </div>
    </motion.article>
  )
}
