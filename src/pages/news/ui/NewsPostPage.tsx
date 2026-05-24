import { useEffect, useState } from 'react'
import { Alert, Card, Spinner, Text } from '@heroui/react'
import { fetchSitePost, type SitePost } from '@/entities/site'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'

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
        <Card>
          <Card.Header className="grid gap-2">
            <Text color="muted" type="body-sm">{formatDate(post.publishedAt)}</Text>
            {post.authorName ? <Text color="muted" type="body-sm">Автор: {post.authorName}</Text> : null}
          </Card.Header>
          <Card.Content className="grid gap-4">
            {hasHtmlMarkup(post.content) ? (
              <div
                className="prose prose-neutral max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              post.content.split(/\n{2,}/).map((paragraph, index) => (
                <Text key={`${post.id}-${index}`} type="body">
                  {paragraph}
                </Text>
              ))
            )}
          </Card.Content>
        </Card>
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
      actions={<HeroLinkButton to={backTo} variant="secondary">К ленте</HeroLinkButton>}
      narrow
    >
      {content}
    </HeroPage>
  )
}
