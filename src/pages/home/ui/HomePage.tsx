import { useReducedMotion } from 'motion/react'
import type { TargetAndTransition } from 'motion/react'
import { ApplySection } from './ApplySection'
import { FloatingActions } from './FloatingActions'
import { HeroSection } from './HeroSection'
import { ReasonsSection } from './ReasonsSection'
import { TrailerSection } from './TrailerSection'

export function HomePage() {
  const shouldReduceMotion = useReducedMotion()
  const revealInitial = shouldReduceMotion ? false : 'hidden'
  const cardHover: TargetAndTransition | undefined = shouldReduceMotion
    ? undefined
    : { y: -8, scale: 1.015 }
  const tapPress: TargetAndTransition | undefined = shouldReduceMotion
    ? undefined
    : { scale: 0.99 }

  return (
    <main className="tycoon-landing xk-adapted">
      <FloatingActions />
      <HeroSection shouldReduceMotion={Boolean(shouldReduceMotion)} />
      <TrailerSection revealInitial={revealInitial} tapPress={tapPress} />
      <ReasonsSection revealInitial={revealInitial} cardHover={cardHover} />
      <ApplySection revealInitial={revealInitial} cardHover={cardHover} />
    </main>
  )
}
