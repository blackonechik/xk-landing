import { motion } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'

type LandingButtonTone = 'default' | 'success' | 'primary'

type LandingButtonProps = ComponentProps<typeof motion.a> & {
  children: ReactNode
  tone?: LandingButtonTone
  contentClassName?: string
  beforeContent?: ReactNode
  arrow?: boolean
}

export function LandingButton({
  children,
  tone = 'default',
  className,
  contentClassName,
  beforeContent,
  arrow = false,
  ...props
}: LandingButtonProps) {
  const toneClass = tone === 'default' ? '' : `tycoon-landing-btn_style-${tone}`

  return (
    <motion.a
      className={['tycoon-landing-btn', toneClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {beforeContent}
      <div
        className={['tycoon-landing-btn__content', contentClassName]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
        {arrow ? (
          <img
            src="/assets/img/general/btn-success-arrow-right.svg"
            className="tycoon-landing-btn__content-arrow ml-1"
            alt=""
          />
        ) : null}
      </div>
    </motion.a>
  )
}
