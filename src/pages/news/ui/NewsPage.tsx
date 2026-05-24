import { useEffect, useState } from 'react'
import { Alert, Card, Spinner, Text } from '@heroui/react'
import AnimatedLink from '@/components/AnimatedLink'
import { fetchSitePosts, type SitePost } from '@/entities/site'
import { HeroPage } from '@/shared/ui/hero-page'

function formatDate(value: string | null) {
  if (!value) {
    return 'Черновик'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function NewsPage() {
  const [posts, setPosts] = useState<SitePost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    void fetchSitePosts()
      .then((nextPosts) => {
        if (!isActive) {
          return
        }

        setPosts(nextPosts)
        setError('')
      })
      .catch(() => {
        if (isActive) {
          setError('Не удалось загрузить ленту новостей.')
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  return (
    <HeroPage
      eyebrow="Новости"
      title="Лента сервера"
      description="Обновления проекта, объявления, изменения правил и важные посты для игроков."
    >
      {isLoading ? (
        <Alert status="accent">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Загружаем посты</Alert.Title>
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

      {!isLoading && !error ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <Card.Header className="grid gap-3">
                <Text color="muted" type="body-sm">{formatDate(post.publishedAt)}</Text>
                <Card.Title>{post.title}</Card.Title>
                <Card.Description>{post.summary}</Card.Description>
              </Card.Header>
              <Card.Content className="grid gap-4">
                <Text color="muted" type="body-sm">
                  {post.authorName ? `Автор: ${post.authorName}` : 'Официальный пост XK HARDCORE'}
                </Text>
                <AnimatedLink className="text-primary underline-offset-4 hover:underline" to={`/news/${post.slug}`}>
                  Читать полностью
                </AnimatedLink>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : null}
    </HeroPage>
  )
}