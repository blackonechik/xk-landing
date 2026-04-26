import { useState } from 'react'
import { motion } from 'motion/react'
import type { TargetAndTransition } from 'motion/react'
import { trailerReveal, viewportReveal } from '@/shared/lib/animation/landingReveal'
import { LandingSection } from '@/shared/ui/landing-section'

type TrailerSectionProps = {
  revealInitial: false | 'hidden'
  tapPress?: TargetAndTransition
}

export function TrailerSection({ revealInitial, tapPress }: TrailerSectionProps) {
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)

  return (
    <LandingSection
      id="start"
      tone="gradient-1"
      title="Посмотрите трейлер сервера"
      className="overflow-hidden"
      wrapperClassName="py-30"
      revealInitial={revealInitial}
    >
      <motion.div
        className="index-start__layout mt-50"
        variants={trailerReveal}
        initial={revealInitial}
        whileInView="show"
        viewport={viewportReveal}
      >
        <div className="index-start__trailer">
          <div className="index-start__trailer-frame">
            <div className="index-start__trailer-surface">
              {isTrailerPlaying ? (
                <iframe
                  className="index-start__trailer-embed"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1"
                  title="XK SMP trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src="https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
                    alt=""
                    className="index-start__trailer-preview"
                  />
                  <div className="index-start__trailer-overlay" aria-hidden="true" />
                  <motion.button
                    type="button"
                    className="index-start__trailer-launcher"
                    onClick={() => setIsTrailerPlaying(true)}
                    aria-label="Включить трейлер сервера"
                    whileTap={tapPress}
                  >
                    <img
                      src="/assets/img/general/section-gradient-1-heading-icon.svg"
                      alt=""
                      className="index-start__trailer-launcher-icon"
                    />
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </LandingSection>
  )
}
