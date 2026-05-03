import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { sectionReveal, viewportReveal } from '@/shared/lib/animation/landingReveal'

type LandingSectionTone = 'gradient-1' | 'green' | 'brown'

type LandingSectionProps = {
  id: string
  tone: LandingSectionTone
  children: ReactNode
  title?: string
  mark?: string
  titleClassName?: string
  markClassName?: string
  iconSrc?: string | Array<string>
  className?: string
  wrapperClassName?: string
  revealInitial?: false | 'hidden'
  withEffect?: boolean
  withEnding?: boolean
  withLine?: boolean
}

export function LandingSection({
  id,
  tone,
  children,
  title,
  mark,
  titleClassName,
  markClassName,
  iconSrc,
  className,
  wrapperClassName = 'py-150',
  revealInitial,
  withEffect = false,
  withEnding = false,
  withLine = true,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={[
        'tycoon-landing-section',
        `tycoon-landing-section_style-${tone}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      >
      <div className="tycoon-landing-section__background" />
      <div className="tycoon-landing-section__background _righted" />
      {withLine ? <div className="tycoon-landing-section__line" /> : null}
      {withEffect ? <div className="tycoon-landing-section__effect" /> : null}

      <div className={['tycoon-landing-wrapper', wrapperClassName].filter(Boolean).join(' ')}>
        {title ? (
          <motion.div
          className="tycoon-landing-section__header"
          variants={sectionReveal}
          initial={revealInitial}
          whileInView="show"
          viewport={viewportReveal}
        >
            {iconSrc ? (
              <div
                className={[
                  'tycoon-landing-section__header-icon',
                  Array.isArray(iconSrc)
                    ? 'tycoon-landing-section__header-icon-group'
                    : '_absolution',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {(Array.isArray(iconSrc) ? iconSrc : [iconSrc]).map((src, index) => (
                  <img key={`${src}-${index}`} src={src} alt="" />
                ))}
              </div>
            ) : null}
            <h2
              className={[
                'tycoon-landing-section__header-text',
                iconSrc ? 'mt-35' : undefined,
                titleClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {title}
              {mark ? (
                <>
                  <br />
                  <span
                    className={['tycoon-landing-section__header-mark', markClassName]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {mark}
                  </span>
                </>
              ) : null}
            </h2>
          </motion.div>
        ) : null}

        {children}
      </div>

      {withEnding ? (
        <img
          src="/assets/img/general/section-ending.png"
          className="tycoon-landing-section__ending"
          alt=""
        />
      ) : null}
    </section>
  )
}
