import { Link } from '@tanstack/react-router'
import { usePageTransitionNavigation } from './PageTransition'
import type { ComponentProps, MouseEvent } from 'react'

type AnimatedLinkProps = ComponentProps<typeof Link>

export default function AnimatedLink({
  onClick,
  target,
  to,
  ...props
}: AnimatedLinkProps) {
  const transitionNavigation = usePageTransitionNavigation()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      !transitionNavigation ||
      typeof to !== 'string' ||
      !to.startsWith('/') ||
      target ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    transitionNavigation.navigateWithTransition({ to })
  }

  return <Link onClick={handleClick} target={target} to={to} {...props} />
}
