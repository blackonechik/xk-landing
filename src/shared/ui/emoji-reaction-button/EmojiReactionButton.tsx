import { Button } from '@heroui/react'
import {
  createContext,
  useContext,
} from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

type EmojiReactionButtonContextValue = {
  count: number
  emoji: ReactNode
}

type EmojiReactionButtonProps = {
  children: ReactNode
  className?: string
  count: number
  emoji: ReactNode
  isSelected?: boolean
  onPress?: () => void
  size?: 'sm' | 'md'
}

const EmojiReactionButtonContext =
  createContext<EmojiReactionButtonContextValue | null>(null)

function useEmojiReactionButtonContext() {
  const context = useContext(EmojiReactionButtonContext)

  if (!context) {
    throw new Error(
      'EmojiReactionButton compound components must be used inside EmojiReactionButton.',
    )
  }

  return context
}

function EmojiReactionButtonRoot({
  children,
  className,
  count,
  emoji,
  isSelected = false,
  onPress,
  size = 'md',
}: EmojiReactionButtonProps) {
  return (
    <EmojiReactionButtonContext.Provider value={{ count, emoji }}>
      <Button
        aria-pressed={isSelected}
        className={[
          'emoji-reaction-button inline-flex items-center gap-2 rounded-full border px-3 shadow-sm',
          'border-[var(--separator)] bg-[var(--surface)] text-foreground transition duration-200',
          'hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)]',
          'data-[pressed=true]:scale-[0.98]',
          isSelected
            ? 'border-[var(--accent)] bg-[var(--accent)]/12 text-[var(--accent)]'
            : '',
          size === 'sm' ? 'min-h-9 text-sm' : 'min-h-10 text-sm',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-pressed={isSelected}
        data-slot="emoji-reaction-button"
        radius="full"
        variant="light"
        onPress={onPress}
      >
        {children}
      </Button>
    </EmojiReactionButtonContext.Provider>
  )
}

function EmojiReaction({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  const { emoji } = useEmojiReactionButtonContext()

  return (
    <span
      className={[
        'emoji-reaction-button__emoji text-base leading-none',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-slot="emoji-reaction-button-emoji"
      {...props}
    >
      {children ?? emoji}
    </span>
  )
}

function EmojiReactionCount({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  const { count } = useEmojiReactionButtonContext()

  return (
    <span
      className={[
        'emoji-reaction-button__count min-w-[1ch] text-xs font-semibold tracking-wide',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-slot="emoji-reaction-button-count"
      {...props}
    >
      {children ?? count}
    </span>
  )
}

export const EmojiReactionButton = Object.assign(EmojiReactionButtonRoot, {
  Count: EmojiReactionCount,
  Emoji: EmojiReaction,
})
