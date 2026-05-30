import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Alert, Card, Chip, Spinner, Text } from '@heroui/react'
import type { SitePost } from '@/entities/site'
import { PlayerAvatar } from '@/entities/account'
import { fetchSitePost } from '@/entities/site'
import { HeroLinkButton } from '@/shared/ui/hero-page'
import { NewsSidebarPromo } from './NewsSidebarPromo'
import { PostEngagementSection } from './PostEngagementSection'

type NewsPostPageProps = {
  slug: string
  backTo?: '/news' | '/cabinet/news'
  embedded?: boolean
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Черновик'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value))
}

function hasHtmlMarkup(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

function getCoverBackground(post: SitePost) {
  if (post.coverImageUrl) {
    return {
      backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.72)), url(${post.coverImageUrl})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }
  }

  return {
    backgroundImage: 'linear-gradient(135deg, #64748b 0%, #1e293b 100%)',
  }
}

export function NewsPostPage({
  slug,
  backTo = '/news',
  embedded = false,
}: NewsPostPageProps) {
  const [post, setPost] = useState<SitePost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    void fetchSitePost(slug)
      .then((nextPost) => {
        if (!isActive) {
          return
        }

        setPost(nextPost)
        setError('')
      })
      .catch((loadError) => {
        if (!isActive) {
          return
        }

        setError(
          loadError instanceof Error && loadError.message === 'POST_NOT_FOUND'
            ? 'Пост не найден.'
            : 'Не удалось загрузить пост.',
        )
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [slug])

  const postContent = useMemo(() => {
    if (!post) {
      return null
    }

    if (hasHtmlMarkup(post.content)) {
      return (
        <div
          className="prose prose-neutral max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )
    }

    return post.content.split(/\n{2,}/).map((paragraph, index) => (
      <Text key={`${post.id}-${index}`} type="body">
        {paragraph}
      </Text>
    ))
  }, [post])

  const authorNickname = post?.authorName ?? post?.submittedByNickname ?? null

  const content = (
    <>
      {isLoading ? (
        <Alert status="accent">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Загружаем пост</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}

      {error ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}

      {post ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="grid gap-6">
            <div className="flex items-center justify-start">
              <HeroLinkButton to={backTo} variant="secondary">
                К ленте
              </HeroLinkButton>
            </div>

            <Card className="overflow-hidden border border-separator bg-surface">
              <Card.Content className="p-0">
                <div
                  className="relative min-h-[280px] border-b border-separator"
                  style={getCoverBackground(post)}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.26),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.82))]" />
                  <div className="relative flex min-h-[280px] flex-col justify-end gap-4 p-6 text-white md:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      {post.isPinned ? (
                        <Chip color="warning" variant="soft">
                          Закрепленный пост
                        </Chip>
                      ) : null}
                      <Text className="text-white/80" type="body-sm">
                        {formatDate(post.publishedAt)}
                      </Text>
                    </div>
                    <div className="grid gap-3">
                      <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                        {post.title}
                      </h1>
                      <Text className="max-w-3xl text-white/80" type="body">
                        {post.summary}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card className="border border-separator bg-surface">
              <Card.Header className="grid gap-2">
                {authorNickname ? (
                  <Link
                    className="group inline-flex w-fit items-center gap-3 rounded-full border border-separator bg-surface-secondary px-3 py-2 transition hover:border-accent hover:bg-surface-elevated"
                    params={{ nickname: authorNickname }}
                    to="/u/$nickname"
                  >
                    <PlayerAvatar
                      alt={authorNickname}
                      className="size-8 border border-white/10 bg-black/20"
                      nickname={authorNickname}
                      size="sm"
                    />
                    <div className="min-w-0 text-left">
                      <Text className="truncate" type="body-sm" weight="semibold">
                        {authorNickname}
                      </Text>
                    </div>
                  </Link>
                ) : (
                  <Text color="muted" type="body-sm">
                    Официальный пост XK HARDCORE
                  </Text>
                )}
              </Card.Header>
              <Card.Content className="grid gap-4">{postContent}</Card.Content>
            </Card>

            <PostEngagementSection slug={post.slug} />
          </div>

          <NewsSidebarPromo />
        </div>
      ) : null}
    </>
  )

  if (embedded) {
    return content
  }

  return (
    <main className="xk-hero-scope min-h-svh bg-background px-4 pb-16 pt-28 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {content}
      </section>
    </main>
  )
}
