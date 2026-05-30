import { Link } from '@tanstack/react-router'
import { Alert, Button, Card, Spinner, Text } from '@heroui/react'
import { MessageCircle, SendHorizonal } from 'lucide-react'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { getCachedAccount, PlayerAvatar } from '@/entities/account'
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
      <Card className="border border-separator bg-surface">
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

      <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-separator bg-surface p-3">
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
          <div className="ml-auto inline-flex items-center rounded-full bg-surface-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            {totalReactions} реакций
          </div>
      </div>

      <Card className="border border-separator bg-surface">
        <Card.Header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Card.Title>Комментарии</Card.Title>
              <Card.Description>
                Оставьте впечатление или продолжите обсуждение поста.
              </Card.Description>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-separator bg-surface-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
              <MessageCircle size={14} />
              {totalComments} комментариев
            </div>
          </div>
        </Card.Header>
        <Card.Content className="grid gap-5 pt-0">
          {cachedAccount ? (
            <div className="flex items-end gap-3 rounded-[28px] border border-separator bg-(--surface-secondary)/55 p-3 sm:p-4">
              <Link
                className="shrink-0"
                params={{ nickname: cachedAccount.player.nickname }}
                to="/u/$nickname"
              >
                <PlayerAvatar
                  alt={cachedAccount.player.nickname}
                  className="size-10 border border-separator bg-surface"
                  nickname={cachedAccount.player.nickname}
                  size="md"
                />
              </Link>
              <div className="min-w-0 flex-1 rounded-[24px] border border-separator bg-surface px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Link
                    className="font-medium text-foreground transition hover:text-accent"
                    params={{ nickname: cachedAccount.player.nickname }}
                    to="/u/$nickname"
                  >
                    {cachedAccount.player.nickname}
                  </Link>
                  <span>пишет комментарий</span>
                </div>
                <textarea
                  className="min-h-24 w-full resize-y bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Напишите комментарий в стиле чата..."
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value)
                  }}
                />
              </div>
              <Button
                className="shrink-0"
                isDisabled={!message.trim()}
                isPending={isSubmittingComment}
                variant="primary"
                onPress={() => {
                  void handleSubmitComment()
                }}
              >
                {!isSubmittingComment ? <SendHorizonal size={16} /> : null}
                Отправить
              </Button>
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-separator bg-(--surface-secondary)/35 p-5">
              <Text type="body" weight="semibold">
                Комментарии доступны только после входа в аккаунт.
              </Text>
              <Text className="mt-1" color="muted" type="body-sm">
                Автор коммента берётся из вашего профиля, поэтому отдельное поле с ником здесь не нужно.
              </Text>
            </div>
          )}

          {engagement.comments.length > 0 ? (
            <div className="grid gap-3">
              {engagement.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 rounded-[28px] border border-separator bg-(--surface-secondary)/45 p-4"
                >
                    <Link
                      className="shrink-0"
                      params={{ nickname: comment.authorNickname }}
                      to="/u/$nickname"
                    >
                      <PlayerAvatar
                        alt={comment.authorNickname}
                        className="size-10 border border-separator bg-surface"
                        nickname={comment.authorNickname}
                        size="md"
                      />
                    </Link>
                    <div className="min-w-0 flex-1 rounded-[22px] bg-surface px-4 py-3">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <Link
                          className="font-semibold text-foreground transition hover:text-accent"
                          params={{ nickname: comment.authorNickname }}
                          to="/u/$nickname"
                        >
                          {comment.authorNickname}
                        </Link>
                        <Text type="body-sm" weight="semibold">
                          {formatCommentDate(comment.createdAt)}
                        </Text>
                      </div>
                      <Text className="mt-2 whitespace-pre-wrap" type="body-sm">
                        {comment.message}
                      </Text>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-separator p-5 text-center">
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
