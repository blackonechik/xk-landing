import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Button,
  Card,
  Chip,
  FieldError,
  Label,
  ListBox,
  SearchField,
  Select,
  Spinner,
  Text,
} from '@heroui/react'
import type { SitePost } from '@/entities/site'
import { fetchSitePosts } from '@/entities/site'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'
import { NewsHeroSlider } from './NewsHeroSlider'

function formatDate(value: string | null) {
  if (!value) {
    return 'Черновик'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

type TimeFilterKey = 'all' | '7d' | '30d' | '365d'

const timeFilterOptions: Array<{
  key: TimeFilterKey
  label: string
  days: number | null
}> = [
  { key: 'all', label: 'За все время', days: null },
  { key: '7d', label: 'За 7 дней', days: 7 },
  { key: '30d', label: 'За 30 дней', days: 30 },
  { key: '365d', label: 'За год', days: 365 },
]

function matchesTimeFilter(post: SitePost, filterKey: TimeFilterKey) {
  const selectedFilter = timeFilterOptions.find((option) => option.key === filterKey)

  if (!selectedFilter || selectedFilter.days === null || !post.publishedAt) {
    return true
  }

  const threshold = Date.now() - selectedFilter.days * 24 * 60 * 60 * 1000
  return new Date(post.publishedAt).getTime() >= threshold
}

function getPostCardBackground(post: SitePost) {
  if (post.coverImageUrl) {
    return post.coverImageUrl
  }

  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#64748b" />
          <stop offset="55%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bg)" />
      <circle cx="640" cy="120" r="140" fill="rgba(255,255,255,0.12)" />
      <circle cx="160" cy="480" r="170" fill="rgba(255,255,255,0.08)" />
    </svg>
  `)

  return `data:image/svg+xml;charset=utf-8,${svg}`
}

type NewsPageProps = {
  basePath?: '/news' | '/cabinet/news'
  embedded?: boolean
}

function getPostRoute(basePath: '/news' | '/cabinet/news') {
  return basePath === '/cabinet/news' ? '/cabinet/news/$slug' : '/news/$slug'
}

export function NewsPage({
  basePath = '/news',
  embedded = false,
}: NewsPageProps) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<SitePost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilterKey>('all')
  const deferredSearchQuery = useDeferredValue(searchQuery)

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

  const pinnedPosts = useMemo(
    () => posts.filter((post) => post.isPinned).slice(0, 6),
    [posts],
  )
  const sliderPosts = pinnedPosts.length > 0 ? pinnedPosts : posts.slice(0, 6)
  const normalizedQuery = deferredSearchQuery.trim().toLowerCase()

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          post.title.toLowerCase().includes(normalizedQuery)

        return matchesQuery && matchesTimeFilter(post, timeFilter)
      }),
    [normalizedQuery, posts, timeFilter],
  )
  const postRoute = getPostRoute(basePath)

  const content = (
    <div className="grid gap-4">
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

      <NewsHeroSlider basePath={basePath} posts={sliderPosts} />

      {!isLoading && !error ? (
        <>
          <Card className="border border-[var(--separator)] bg-[var(--surface)]">
            <Card.Content className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
              <div className="grid gap-2">
                <SearchField
                  className="grid gap-2"
                  value={searchQuery}
                  onChange={setSearchQuery}
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Найти пост по названию" />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                  <FieldError />
                </SearchField>
                <Text color="muted" type="body-sm">
                  Показано {filteredPosts.length} из {posts.length} постов
                </Text>
              </div>

              <Select
                selectedKey={timeFilter}
                onSelectionChange={(key) => {
                  if (typeof key === 'string') {
                    setTimeFilter(key as TimeFilterKey)
                  }
                }}
              >
                <Label>Период</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {timeFilterOptions.map((option) => (
                      <ListBox.Item
                        key={option.key}
                        id={option.key}
                        textValue={option.label}
                      >
                        {option.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </Card.Content>
          </Card>
                    
          {filteredPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="relative min-h-[340px] overflow-hidden rounded-3xl border border-[var(--separator)] bg-[var(--surface)]"
                >
                  <img
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                    src={getPostCardBackground(post)}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,20,0.06)_0%,rgba(8,10,20,0.24)_28%,rgba(8,10,20,0.8)_74%,rgba(4,6,12,0.96)_100%)]" />

                  <Card.Header className="relative z-10 grid gap-2 p-5 text-white">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.isPinned ? (
                        <Chip color="warning" variant="soft">
                          Закреплен
                        </Chip>
                      ) : (
                        <Chip color="accent" variant="soft">
                          Новости
                        </Chip>
                      )}
                      <Text className="text-white/72" type="body-sm">
                        {formatDate(post.publishedAt)}
                      </Text>
                    </div>

                    <div className="grid gap-1">
                      <Card.Title className="text-lg leading-tight text-white">
                        {post.title}
                      </Card.Title>
                      <Card.Description className="line-clamp-3 text-sm leading-6 text-white/72">
                        {post.summary}
                      </Card.Description>
                    </div>
                  </Card.Header>

                  <Card.Footer className="relative z-10 mt-auto flex items-end justify-between gap-3 p-5 text-white">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-white">
                        {post.authorName ?? 'Команда XK HARDCORE'}
                      </div>
                      <div className="text-xs text-white/60">Открыть публикацию</div>
                    </div>
                    <Button
                      className="shrink-0 bg-white text-black"
                      size="sm"
                      variant="solid"
                      onPress={() => {
                        void navigate({
                          params: { slug: post.slug },
                          to: postRoute,
                        })
                      }}
                    >
                      Открыть
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-[var(--separator)] bg-[var(--surface)]">
              <Card.Content className="grid gap-2 p-6">
                <Text type="body">Посты не найдены</Text>
                <Text color="muted" type="body-sm">
                  Попробуйте изменить название в поиске или выбрать другой
                  период публикации.
                </Text>
              </Card.Content>
            </Card>
          )}
        </>
      ) : null}
    </div>
  )

  if (embedded) {
    return content
  }

  return (
    <HeroPage
      eyebrow="Новости"
      title="Посты"
      description="Лента сервера, объявления команды и последние публикации XK HARDCORE."
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
