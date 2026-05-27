import { Avatar, Button, Card, Input, Text } from '@heroui/react'
import { MessageCircle, SendHorizonal } from 'lucide-react'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { getCachedAccount } from '@/entities/account'
import { EmojiReactionButton } from '@/shared/ui/emoji-reaction-button'

type PostEngagementSectionProps = {
  postId: string
}

type ReactionOption = {
  emoji: string
  key: string
}

type StoredComment = {
  author: string
  createdAt: string
  id: string
  message: string
}

type StoredEngagement = {
  comments: StoredComment[]
  reactions: Record<string, number>
  selectedReactionKey: string | null
}

const reactionOptions: ReactionOption[] = [
  { emoji: '❤️', key: 'heart' },
  { emoji: '🎉', key: 'party' },
  { emoji: '👍', key: 'like' },
  { emoji: '😂', key: 'laugh' },
  { emoji: '🚀', key: 'rocket' },
]

const defaultReactionCounts: Record<string, number> = {
  heart: 12,
  laugh: 3,
  like: 5,
  party: 1,
  rocket: 1,
}

function getStorageKey(postId: string) {
  return `xk:post-engagement:${postId}`
}

function readStoredEngagement(postId: string): StoredEngagement {
  if (typeof window === 'undefined') {
    return {
      comments: [],
      reactions: defaultReactionCounts,
      selectedReactionKey: null,
    }
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(postId))

    if (!raw) {
      return {
        comments: [],
        reactions: defaultReactionCounts,
        selectedReactionKey: null,
      }
    }

    const parsed = JSON.parse(raw) as Partial<StoredEngagement>

    return {
      comments: Array.isArray(parsed.comments) ? parsed.comments : [],
      reactions: {
        ...defaultReactionCounts,
        ...(parsed.reactions ?? {}),
      },
      selectedReactionKey:
        typeof parsed.selectedReactionKey === 'string'
          ? parsed.selectedReactionKey
          : null,
    }
  } catch {
    return {
      comments: [],
      reactions: defaultReactionCounts,
      selectedReactionKey: null,
    }
  }
}

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function PostEngagementSection({
  postId,
}: PostEngagementSectionProps) {
  const cachedAccount = getCachedAccount()
  const [engagement, setEngagement] = useState<StoredEngagement>(() =>
    readStoredEngagement(postId),
  )
  const [author, setAuthor] = useState(
    () => cachedAccount?.player.nickname ?? '',
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    setEngagement(readStoredEngagement(postId))
  }, [postId])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(getStorageKey(postId), JSON.stringify(engagement))
  }, [engagement, postId])

  const totalComments = engagement.comments.length
  const totalReactions = useMemo(
    () =>
      Object.values(engagement.reactions).reduce(
        (sum, currentValue) => sum + currentValue,
        0,
      ),
    [engagement.reactions],
  )

  function handleReactionPress(reactionKey: string) {
    startTransition(() => {
      setEngagement((currentValue) => {
        const nextReactions = { ...currentValue.reactions }

        if (currentValue.selectedReactionKey === reactionKey) {
          nextReactions[reactionKey] = Math.max(
            0,
            (nextReactions[reactionKey] ?? 0) - 1,
          )

          return {
            ...currentValue,
            reactions: nextReactions,
            selectedReactionKey: null,
          }
        }

        if (currentValue.selectedReactionKey) {
          const previousKey = currentValue.selectedReactionKey
          nextReactions[previousKey] = Math.max(
            0,
            (nextReactions[previousKey] ?? 0) - 1,
          )
        }

        nextReactions[reactionKey] = (nextReactions[reactionKey] ?? 0) + 1

        return {
          ...currentValue,
          reactions: nextReactions,
          selectedReactionKey: reactionKey,
        }
      })
    })
  }

  function handleSubmitComment() {
    const normalizedAuthor = author.trim() || 'Гость'
    const normalizedMessage = message.trim()

    if (!normalizedMessage) {
      return
    }

    startTransition(() => {
      setEngagement((currentValue) => ({
        ...currentValue,
        comments: [
          {
            author: normalizedAuthor,
            createdAt: new Date().toISOString(),
            id: crypto.randomUUID(),
            message: normalizedMessage,
          },
          ...currentValue.comments,
        ],
      }))
      setMessage('')
    })
  }

  return (
    <div className="grid gap-6">
      <Card className="border border-[var(--separator)] bg-[var(--surface)]">
        <Card.Header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Card.Title>Реакции</Card.Title>
              <Card.Description>
                Выберите одну реакцию на пост. Состояние сохраняется локально.
              </Card.Description>
            </div>
            <div className="rounded-full border border-[var(--separator)] bg-[var(--surface-secondary)] px-3 py-1 text-xs font-semibold text-muted-foreground">
              {totalReactions} реакций
            </div>
          </div>
        </Card.Header>
        <Card.Content className="flex flex-wrap items-center gap-2 pt-0">
          {reactionOptions.map((reaction) => (
            <EmojiReactionButton
              key={reaction.key}
              count={engagement.reactions[reaction.key] ?? 0}
              emoji={reaction.emoji}
              isSelected={engagement.selectedReactionKey === reaction.key}
              onPress={() => {
                handleReactionPress(reaction.key)
              }}
            >
              <EmojiReactionButton.Emoji />
              <EmojiReactionButton.Count />
            </EmojiReactionButton>
          ))}
        </Card.Content>
      </Card>

      <Card className="border border-[var(--separator)] bg-[var(--surface)]">
        <Card.Header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Card.Title>Комментарии</Card.Title>
              <Card.Description>
                Оставьте впечатление или продолжите обсуждение поста.
              </Card.Description>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--separator)] bg-[var(--surface-secondary)] px-3 py-1 text-xs font-semibold text-muted-foreground">
              <MessageCircle size={14} />
              {totalComments} комментариев
            </div>
          </div>
        </Card.Header>
        <Card.Content className="grid gap-5 pt-0">
          <div className="grid gap-3 rounded-3xl border border-[var(--separator)] bg-[var(--surface-secondary)]/55 p-4">
            <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
              <Input
                label="Ваше имя"
                placeholder="Например, Vlad"
                value={author}
                onChange={(event) => {
                  setAuthor(event.target.value)
                }}
              />
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">
                  Комментарий
                </span>
                <textarea
                  className="min-h-28 rounded-2xl border border-[var(--separator)] bg-[var(--surface)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                  placeholder="Поделитесь впечатлениями о посте..."
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value)
                  }}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <Button
                color="primary"
                onPress={handleSubmitComment}
              >
                <SendHorizonal size={16} />
                Отправить комментарий
              </Button>
            </div>
          </div>

          {engagement.comments.length > 0 ? (
            <div className="grid gap-3">
              {engagement.comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="border border-[var(--separator)] bg-[var(--surface-secondary)]/45"
                >
                  <Card.Content className="flex items-start gap-3">
                    <Avatar
                      className="shrink-0 border border-[var(--separator)] bg-[var(--surface)]"
                      name={comment.author}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Text type="body-sm" weight="semibold">
                          {comment.author}
                        </Text>
                        <Text color="muted" type="body-sm">
                          {formatCommentDate(comment.createdAt)}
                        </Text>
                      </div>
                      <Text className="mt-2 whitespace-pre-wrap" type="body-sm">
                        {comment.message}
                      </Text>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--separator)] p-5 text-center">
              <Text type="body">Пока нет комментариев</Text>
              <Text className="mt-1" color="muted" type="body-sm">
                Станьте первым, кто оставит отзыв на этот пост.
              </Text>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
