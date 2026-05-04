import { useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { sectionReveal, viewportReveal } from '@/shared/lib/animation/landingReveal'
import { LandingSection } from '@/shared/ui/landing-section'

type LifeSectionProps = {
  revealInitial: false | 'hidden'
  shouldReduceMotion: boolean
}

export function LifeSection({ revealInitial, shouldReduceMotion }: LifeSectionProps) {
  const mediaRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isVideoVisible = useInView(mediaRef, {
    amount: 0.2,
  })
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ['start end', 'end start'],
  })
  const captionOpacity = useTransform(scrollYProgress, [0.3, 0.42, 0.62], [0, 1, 1])
  const captionX = useTransform(scrollYProgress, [0.3, 0.42], [-400, 0])

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    video.muted = true
    video.defaultMuted = true

    if (isVideoVisible) {
      video.play().catch(() => {})

      return
    }

    video.pause()

    return () => {
      video.pause()
    }
  }, [isVideoVisible])

  return (
    <>
      <LandingSection
        id="life"
        tone="brown"
        title="Механика жизней"
        titleClassName="tycoon-color-orange-2"
        markClassName="tycoon-color-yellow"
        iconSrc={[
          '/assets/img/general/resized_32_heart.png',
          '/assets/img/general/resized_32_heart.png',
        ]}
        revealInitial={revealInitial}
        wrapperClassName="py-30"
        withEffect
      >
        <motion.div
          className="xk-life-section__copy"
          variants={sectionReveal}
          initial={revealInitial}
          whileInView="show"
          viewport={viewportReveal}
        >
          <p>
            На ХК HARDCORE у каждого игрока только две жизни.
          </p>
          <p>
            Находясь при смерти, всё, что Вам остаётся делать - ждать своих друзей, ведь только они могут спасти Вас от потери жизни.
          </p>
        </motion.div>
      </LandingSection>

      <section
        ref={mediaRef}
        className={[
          'parallax-video',
          'xk-life-media',
          shouldReduceMotion ? 'xk-life-media--static' : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Демонстрация помощи игроку на сервере"
      >
        <div className="parallax-video__sticky">
          <div className="parallax-video__layer">
            <video
              ref={videoRef}
              className="parallax-video__media"
              src="/assets/video/helplife.mp4"
              muted
              playsInline
              preload="metadata"
              loop
            />
          </div>

          <motion.p
            className="parallax-video__caption"
            style={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: captionOpacity,
                    x: captionX,
                  }
            }
          >
            У ваших друзей будет полторы минуты, чтобы спасти вас от смерти. 
          </motion.p>
        </div>
      </section>
    </>
  )
}
