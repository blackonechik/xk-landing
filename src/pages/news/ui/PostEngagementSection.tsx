import { Alert, Avatar, Button, Card, Input, Spinner, Text } from '@heroui/react'
import { MessageCircle, SendHorizonal } from 'lucide-react'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { getCachedAccount } from '@/entities/account'
import type { PostReactionKey, SitePostEngagement } from '@/entities/site'
import {
  createSitePostComment,
  fetchSitePostEngagement,
  setSitePostReaction,
} from '@/entities/site'
import { EmojiReactionButton } from '@/shared/ui/emoji-reaction-button'

type PostEngagementSectionProps = {
  slug: string
}

type ReactionOption = {
  emoji: string
  key: PostReactionKey
}

const reactionOptions: ReactionOption[] = [
  { emoji: '❤️', key: 'heart' },
  { emoji: '🎉', key: 'party' },
  { emoji: '👍', key: 'like' },
  { emoji: '😂', key: 'laugh' },
  { emoji: '🚀', key: 'rocket' },
]

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function PostEngagementSection({
  slug,
}: PostEngagementSectionProps) {
  const cachedAccount = getCachedAccount()
  const [engagement, setEngagement] = useState<SitePostEngagement | null>(null)
  const [author, setAuthor] = useState(
    () => cachedAccount?.player.nickname ?? '',
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isSubmittingReaction, setIsSubmittingReaction] = useState(false)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError('')

    void fetchSitePostEngagement(slug)
      .then((nextEngagement) => {
        if (!active) {
          return
        }

        setEngagement(nextEngagement)
      })
      .catch((loadError) => {
        if (!active) {
          return
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Не удалось загрузить реакции и комментарии.',
        )
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [slug])

  const totalComments = engagement?.comments.length ?? 0
  const totalReactions = useMemo(
    () =>
      engagement
        ? Object.values(engagement.reactionTotals).reduce(
            (sum, currentValue) => sum + currentValue,
            0,
          )
        : 0,
    [engagement],
  )

  async function handleReactionPress(reactionKey: PostReactionKey) {
    if (!engagement || isSubmittingReaction) {
      return
    }

    setIsSubmittingReaction(true)
    setError('')

    try {
      const nextEngagement = await setSitePostReaction(
        slug,
        engagement.currentUserReaction === reactionKey ? null : reactionKey,
      )

      startTransition(() => {
        setEngagement(nextEngagement)
      })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Не удалось сохранить реакцию.',
      )
    } finally {
      setIsSubmittingReaction(false)
    }
  }

  async function handleSubmitComment() {
    const normalizedMessage = message.trim()

    if (!normalizedMessage || isSubmittingComment) {
      return
    }

    setIsSubmittingComment(true)
    setError('')

    try {
      const result = await createSitePostComment(slug, normalizedMessage)

      startTransition(() => {
        setEngagement(result.engagement)
        setMessage('')
        setAuthor(cachedAccount?.player.nickname ?? author)
      })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Не удалось отправить комментарий.',
      )
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (isLoading || !engagement) {
    return (
      <Card className="border border-[var(--separator)] bg-[var(--surface)]">
        <Card.Content className="flex items-center gap-3">
          <Spinner size="sm" />
          <Text type="body-sm">Загружаем реакции и комментарии...</Text>
        </Card.Content>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {error ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}

      <Card className="border border-[var(--separator)] bg-[var(--surface)]">
        <Card.Header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Card.Title>Реакции</Card.Title>
              <Card.Description>
                Выберите одну реакцию на пост.
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
              count={engagement.reactionTotals[reaction.key]}
              emoji={reaction.emoji}
              isSelected={engagement.currentUserReaction === reaction.key}
              onPress={() => {
                void handleReactionPress(reaction.key)
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
                isDisabled={Boolean(cachedAccount?.player.nickname)}
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
                isLoading={isSubmittingComment}
                onPress={() => {
                  void handleSubmitComment()
                }}
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
                      name={comment.authorNickname}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Text type="body-sm" weight="semibold">
                          {comment.authorNickname}
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
