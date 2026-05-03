import { LandingButton } from '@/shared/ui/landing-button'

export function FloatingActions() {
  return (
    <>
      <LandingButton
        href="#apply"
        tone="success"
        className="index-fixed _right"
        contentClassName="text-40"
        style={{ opacity: 1 }}
        arrow
      >
        Играть
      </LandingButton>
    </>
  )
}
