import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import {
  Alert,
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
import { Plus } from 'lucide-react'
import AnimatedLink from '@/components/AnimatedLink'
import { fetchSitePosts, type SitePost } from '@/entities/site'
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
                  className="border border-[var(--separator)] bg-[var(--surface)]"
                >
                  <Card.Content className="grid h-full gap-4 p-5">
                    <div
                      className="h-44 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#64748b_0%,#1e293b_100%)] bg-cover bg-center"
                      style={
                        post.coverImageUrl
                          ? {
                              backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.65)), url(${post.coverImageUrl})`,
                            }
                          : undefined
                      }
                    />

                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {post.isPinned ? (
                          <Chip color="warning" variant="soft">
                            Закреплен
                          </Chip>
                        ) : null}
                        <Text color="muted" type="body-sm">
                          {formatDate(post.publishedAt)}
                        </Text>
                      </div>

                      <div className="grid gap-2">
                        <Text type="body">{post.title}</Text>
                        <Text color="muted" type="body-sm">
                          {post.summary}
                        </Text>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3">
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
                  </Card.Content>
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
        basePath === '/cabinet/news' ? (
          <HeroLinkButton to="/cabinet/admin/posts" variant="secondary">
            <Plus size={18} />
            Написать пост
          </HeroLinkButton>
        ) : (
          <>
            <HeroLinkButton to="/join" variant="secondary">
              Подать заявку
            </HeroLinkButton>
            <HeroLinkButton to="/rules" variant="ghost">
              Правила
            </HeroLinkButton>
          </>
        )
      }
    >
      {content}
    </HeroPage>
  )
}
