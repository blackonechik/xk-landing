import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, Chip, Spinner, Text } from '@heroui/react'
import type { SitePost } from '@/entities/site'
import { fetchSitePost } from '@/entities/site'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'
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
            <Card className="overflow-hidden border border-[var(--separator)] bg-[var(--surface)]">
              <Card.Content className="p-0">
                <div
                  className="relative min-h-[280px] border-b border-[var(--separator)]"
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

            <Card className="border border-[var(--separator)] bg-[var(--surface)]">
              <Card.Header className="grid gap-2">
                <Text color="muted" type="body-sm">
                  {post.authorName
                    ? `Автор: ${post.authorName}`
                    : 'Официальный пост XK HARDCORE'}
                </Text>
              </Card.Header>
              <Card.Content className="grid gap-4">{postContent}</Card.Content>
            </Card>

            <PostEngagementSection postId={post.id} />
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
    <HeroPage
      eyebrow="Новости"
      title={post?.title ?? 'Загружаем пост'}
      description={post?.summary ?? 'Подгружаем публикацию сервера.'}
      actions={
        <HeroLinkButton to={backTo} variant="secondary">
          К ленте
        </HeroLinkButton>
      }
      narrow={false}
    >
      {content}
    </HeroPage>
  )
}
