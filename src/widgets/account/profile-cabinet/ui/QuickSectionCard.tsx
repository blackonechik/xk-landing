import AnimatedLink from '@/components/AnimatedLink'
import type { QuickSectionCardProps } from '../model/profile-status.types'
import { QuickSectionArrowIcon } from './quick-section-icons/QuickSectionArrowIcon'

export function QuickSectionCard({
  cardClassName,
  description,
  gradient,
  href,
  icon,
  imageSrc,
  imageClassName,
  onPress,
  textClassName,
  title,
}: QuickSectionCardProps) {
  const content = (
    <div
      className={[
        'group relative isolate flex max-h-[310px] w-full cursor-pointer justify-end overflow-visible rounded-2xl',
        cardClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 origin-center transform-gpu rounded-2xl rotate-0 scale-100 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:rotate-[0.6deg] motion-safe:group-hover:scale-[1.015]"
        style={{ backgroundImage: gradient }}
      />

      <img
        alt=""
        aria-hidden
        className={[
          'pointer-events-none absolute bottom-0 left-0 z-10 h-full w-auto origin-bottom-left transform-gpu rotate-0 scale-100 object-contain object-bottom-right motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:-rotate-2 motion-safe:group-hover:scale-[1.035]',
          imageClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        src={imageSrc}
      />

      <div className="relative z-20 flex h-full flex-col p-4 max-[1820px]:w-3/4">
        <div
          className="text-[#fdfcfc]"
          style={{ filter: 'drop-shadow(-2px 1px 0px #2d3935)' }}
        >
          {icon}
        </div>

        <div
          className={['mt-[12px] grid gap-2', textClassName]
            .filter(Boolean)
            .join(' ')}
          style={{ filter: 'drop-shadow(-2px 1px 0px #2d3935)' }}
        >
          <p className="text-left text-3xl font-bold leading-none text-[#fdfcfc]">
            {title}
          </p>
          <p className="text-left text-xs font-semibold leading-5 text-[#a7a7a7]">
            {description}
          </p>
        </div>

        <div className="mt-auto flex justify-end text-[#fdfcfc]">
          <QuickSectionArrowIcon />
        </div>
      </div>
    </div>
  )

  if (onPress) {
    return (
      <button
        className="block h-full w-full text-left"
        type="button"
        onClick={onPress}
      >
        {content}
      </button>
    )
  }

  if (!href) {
    return content
  }

  return (
    <AnimatedLink className="block h-full w-full" to={href}>
      {content}
    </AnimatedLink>
  )
}
