import { motion } from 'motion/react'
import { heroContent } from '../model/homeContent'
import { getHeroVideoSource } from '../model/landing-video'
import { MinecraftHeroScene } from './MinecraftHeroScene'
import { LandingButton } from '@/shared/ui/landing-button'

type HeroSectionProps = {
  shouldReduceMotion: boolean
}

export function HeroSection({ shouldReduceMotion }: HeroSectionProps) {
  return (
    <section id="header" className="tycoon-landing-header xk-header-hero">
      <motion.video
        src={getHeroVideoSource()}
        className="tycoon-landing-header__background"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                scale: 1.08,
                filter: 'brightness(0.45) saturate(0.7) blur(8px)',
              }
        }
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'brightness(0.84) saturate(0.9) blur(0px)',
        }}
        transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="tycoon-landing-header__hero xk-minecraft-hero"
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0, x: 90, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <MinecraftHeroScene />
      </motion.div>

      <div className="tycoon-landing-header__container px-150">
        <div className="row justify-content-start">
          <div className="col-12 col-md-9 col-lg-6">
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: -84,
                      filter: 'blur(8px)',
                    }
              }
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.28,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="tycoon-landing-header__logo xk-header-logo">
                <div className="xk-header-logo__text">
                  <span className="xk-header-logo__caption">{heroContent.caption}</span>
                  <strong>{heroContent.title}</strong>
                  <small>{heroContent.subtitle}</small>
                </div>
              </div>

              <div className="tycoon-landing-header__container-content">
                <p className="xk-header-copy">{heroContent.description}</p>
                <LandingButton
                  href="#apply"
                  tone="success"
                  contentClassName="text-40"
                  beforeContent={<div className="tycoon-landing-header__play-bright" />}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  arrow
                >
                  Подать заявку
                </LandingButton>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.a
        href="#start"
        className="tycoon-landing-header__arrow"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Прокрутить вниз"
      >
        <span className="tycoon-landing-header__arrow-icon" aria-hidden="true" />
      </motion.a>
    </section>
  )
}
