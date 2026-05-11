import { motion } from 'motion/react'
import { usePageTransitionNavigation } from '@/components/PageTransition'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'

type LandingButtonTone = 'default' | 'success' | 'primary'

type SharedLandingButtonProps = {
  children: ReactNode
  tone?: LandingButtonTone
  contentClassName?: string
  beforeContent?: ReactNode
  arrow?: boolean
  arrowTone?: LandingButtonTone
}

type LandingButtonProps =
  | (SharedLandingButtonProps & ComponentProps<typeof motion.a> & { as?: 'a' })
  | (SharedLandingButtonProps & ComponentProps<typeof motion.button> & { as: 'button' })

export function LandingButton(props: LandingButtonProps) {
  const transitionNavigation = usePageTransitionNavigation()
  const {
    children,
    tone = 'default',
    className,
    contentClassName,
    beforeContent,
    arrow = false,
    arrowTone = tone,
  } = props
  const toneClass = tone === 'default' ? '' : `tycoon-landing-btn_style-${tone}`
  const buttonClassName = ['tycoon-landing-btn', toneClass, className].filter(Boolean).join(' ')
  const content = (
    <>
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
            className={[
              'tycoon-landing-btn__content-arrow',
              `tycoon-landing-btn__content-arrow_${arrowTone}`,
              'ml-1',
            ].join(' ')}
            alt=""
          />
        ) : null}
      </div>
    </>
  )

  if (props.as === 'button') {
    const { as: _as, children: _children, tone: _tone, contentClassName: _contentClassName, beforeContent: _beforeContent, arrow: _arrow, arrowTone: _arrowTone, className: _className, ...buttonProps } = props

    return (
      <motion.button className={buttonClassName} {...buttonProps}>
        {content}
      </motion.button>
    )
  }

  const { as: _as, children: _children, tone: _tone, contentClassName: _contentClassName, beforeContent: _beforeContent, arrow: _arrow, arrowTone: _arrowTone, className: _className, onClick, ...anchorProps } = props
  const href = typeof anchorProps.href === 'string' ? anchorProps.href : undefined
  const isInternalRoute = href?.startsWith('/') === true

  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      !isInternalRoute ||
      !transitionNavigation ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      anchorProps.target
    ) {
      return
    }

    event.preventDefault()
    transitionNavigation.navigateWithTransition({ to: href })
  }

  return (
    <motion.a className={buttonClassName} onClick={handleAnchorClick} {...anchorProps}>
      {content}
    </motion.a>
  )
}
