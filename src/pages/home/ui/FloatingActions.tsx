import { LandingButton } from '@/shared/ui/landing-button'

export function FloatingActions() {
  return (
    <>
      <LandingButton
        href="#header"
        className="index-fixed _left"
        contentClassName="px-35"
        style={{ opacity: 1 }}
      >
        <img src="/assets/img/general/btn-default-arrow-up.svg" alt="" />
      </LandingButton>

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
