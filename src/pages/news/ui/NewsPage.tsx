import { useEffect, useState } from 'react'
import { Alert, Card, Chip, Spinner, Text } from '@heroui/react'
import AnimatedLink from '@/components/AnimatedLink'
import { fetchSitePosts, type SitePost } from '@/entities/site'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'

function formatDate(value: string | null) {
  if (!value) {
    return 'Черновик'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

type NewsPageProps = {
  basePath?: '/news' | '/cabinet/news'
  embedded?: boolean
}

export function NewsPage({
  basePath = '/news',
  embedded = false,
}: NewsPageProps) {
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

  const latestPost = posts[0] ?? null
  const recentPosts = posts.slice(1, 4)
  const archivePosts = posts.slice(4)

  const content = (
    <>
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
        <div className="grid gap-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            {latestPost ? (
              <Card className="overflow-hidden border border-[var(--separator)] bg-[var(--surface)]">
                <Card.Header className="grid gap-4 p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Chip color="accent" variant="soft">
                      Свежий пост
                    </Chip>
                    <Text color="muted" type="body-sm">
                      {formatDate(latestPost.publishedAt)}
                    </Text>
                  </div>
                  <div className="grid gap-3">
                    <Card.Title>{latestPost.title}</Card.Title>
                    <Card.Description>{latestPost.summary}</Card.Description>
                  </div>
                </Card.Header>
                <Card.Content className="grid gap-5 p-6 pt-0">
                  <Text color="muted" type="body-sm">
                    {latestPost.authorName
                      ? `Автор: ${latestPost.authorName}`
                      : 'Официальный пост XK HARDCORE'}
                  </Text>
                  <div className="flex flex-wrap gap-3">
                      <HeroLinkButton
                      to={`${basePath}/${latestPost.slug}`}
                      variant="secondary"
                    >
                      Читать полностью
                    </HeroLinkButton>
                  </div>
                </Card.Content>
              </Card>
            ) : null}

            <div className="grid gap-6">
              <Card className="border border-[var(--separator)] bg-[var(--surface)]">
                <Card.Header className="grid gap-2">
                  <Card.Title>Последние посты</Card.Title>
                  <Card.Description>
                    Короткий обзор свежих публикаций и обновлений сервера.
                  </Card.Description>
                </Card.Header>
                <Card.Content className="grid gap-3">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                      <AnimatedLink
                        key={post.id}
                        className="grid gap-1 rounded-lg border border-[var(--separator)] px-4 py-3 transition-colors hover:bg-[var(--surface-secondary)]"
                        to={`${basePath}/${post.slug}`}
                      >
                        <Text type="body-sm">{post.title}</Text>
                        <Text color="muted" type="body-sm">
                          {formatDate(post.publishedAt)}
                        </Text>
                      </AnimatedLink>
                    ))
                  ) : (
                    <Text color="muted" type="body-sm">
                      Пока опубликован только один пост.
                    </Text>
                  )}
                </Card.Content>
              </Card>

              <Card className="border border-[var(--separator)] bg-[var(--surface)]">
                <Card.Header className="grid gap-2">
                  <Card.Title>Реклама</Card.Title>
                  <Card.Description>
                    Сервер открыт для новых игроков, союзов и совместных историй.
                  </Card.Description>
                </Card.Header>
                <Card.Content className="grid gap-4">
                  <Text color="muted" type="body-sm">
                    Если давно искал хардкорный сервер с упором на доверие,
                    жизни и совместное выживание, сейчас как раз хороший момент
                    присоединиться.
                  </Text>
                  <div className="flex flex-wrap gap-3">
                    <HeroLinkButton to="/join" variant="secondary">
                      Оставить заявку
                    </HeroLinkButton>
                    <HeroLinkButton to="/offer" variant="ghost">
                      Что предлагает сервер
                    </HeroLinkButton>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>

          <Card className="border border-[var(--separator)] bg-[var(--surface)]">
            <Card.Header className="grid gap-2">
              <Card.Title>Архив публикаций</Card.Title>
              <Card.Description>
                Все вышедшие посты, объявления и заметки команды XK HARDCORE.
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="grid gap-3 rounded-xl border border-[var(--separator)] p-4"
                >
                  <div className="grid gap-2">
                    <Text color="muted" type="body-sm">
                      {formatDate(post.publishedAt)}
                    </Text>
                    <Text type="body">{post.title}</Text>
                    <Text color="muted" type="body-sm">
                      {post.summary}
                    </Text>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Text color="muted" type="body-sm">
                      {post.authorName ?? 'Команда XK HARDCORE'}
                    </Text>
                    <AnimatedLink
                      className="text-primary underline-offset-4 hover:underline"
                      to={`${basePath}/${post.slug}`}
                    >
                      Открыть
                    </AnimatedLink>
                  </div>
                </div>
              ))}
            </Card.Content>
          </Card>

          {archivePosts.length > 0 ? (
            <Card className="border border-[var(--separator)] bg-[var(--surface)]">
              <Card.Header>
                <Card.Title>Ранее опубликовано</Card.Title>
              </Card.Header>
              <Card.Content className="grid gap-3">
                {archivePosts.map((post) => (
                  <AnimatedLink
                    key={`archive-${post.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--separator)] px-4 py-3 transition-colors hover:bg-[var(--surface-secondary)]"
                    to={`${basePath}/${post.slug}`}
                  >
                    <div className="grid gap-1">
                      <Text type="body-sm">{post.title}</Text>
                      <Text color="muted" type="body-sm">
                        {post.summary}
                      </Text>
                    </div>
                    <Text color="muted" type="body-sm">
                      {formatDate(post.publishedAt)}
                    </Text>
                  </AnimatedLink>
                ))}
              </Card.Content>
            </Card>
          ) : null}
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
      title="Лента сервера"
      description="Обновления проекта, объявления, изменения правил и важные посты для игроков."
      actions={
        <>
          <HeroLinkButton to="/join" variant="secondary">
            Подать заявку
          </HeroLinkButton>
          <HeroLinkButton to="/rules" variant="ghost">
            Правила
          </HeroLinkButton>
        </>
      }
    >
      {content}
    </HeroPage>
  )
}
