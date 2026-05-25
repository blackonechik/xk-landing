import { useState } from 'react'
import { Button, Card, Chip, Text } from '@heroui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { SitePost } from '@/entities/site'
import { HeroLinkButton } from '@/shared/ui/hero-page'

type NewsHeroSliderProps = {
  basePath: '/news' | '/cabinet/news'
  posts: SitePost[]
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Скоро появится'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
  }).format(new Date(value))
}

const placeholderSlides: SitePost[] = [
  {
    id: 'placeholder-first-post',
    slug: '',
    title: 'Здесь появятся первые посты сервера',
    summary:
      'Когда команда опубликует первые новости, этот слайдер покажет закрепленные анонсы, события и важные объявления.',
    content: '',
    coverTone: 'slate',
    coverImageUrl: null,
    isPinned: false,
    pinnedOrder: null,
    isPublished: false,
    authorName: null,
    publishedAt: null,
    createdAt: '',
    updatedAt: '',
  },
]

function getCoverBackground(post: SitePost) {
  if (post.coverImageUrl) {
    return {
      backgroundImage: `linear-gradient(125deg, rgba(17, 24, 39, 0.2), rgba(15, 23, 42, 0.75)), url(${post.coverImageUrl})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }
  }

  const toneMap: Record<string, string> = {
    slate: 'linear-gradient(135deg, #5d6b83 0%, #1f2937 100%)',
    amber: 'linear-gradient(135deg, #f59e0b 0%, #7c2d12 100%)',
    emerald: 'linear-gradient(135deg, #34d399 0%, #064e3b 100%)',
    rose: 'linear-gradient(135deg, #fb7185 0%, #881337 100%)',
    violet: 'linear-gradient(135deg, #a78bfa 0%, #4c1d95 100%)',
    sky: 'linear-gradient(135deg, #38bdf8 0%, #0f172a 100%)',
    zinc: 'linear-gradient(135deg, #a1a1aa 0%, #27272a 100%)',
  }

  return {
    backgroundImage:
      toneMap[post.coverTone] ??
      'linear-gradient(135deg, #64748b 0%, #1e293b 100%)',
  }
}

export function NewsHeroSlider({ basePath, posts }: NewsHeroSliderProps) {
  const slides = posts.length > 0 ? posts : placeholderSlides
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSlide = slides[currentIndex] ?? slides[0]

  function showPrev() {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  function showNext() {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <Card className="overflow-hidden border border-[var(--separator)] bg-[var(--surface)]">
      <Card.Header className="flex items-start justify-between gap-4 p-6">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <Chip color="accent" variant="soft">
              {posts.length > 0 ? 'Слайдер постов' : 'Первые новости впереди'}
            </Chip>
            <Text color="muted" type="body-sm">
              {posts.length > 0
                ? `${currentIndex + 1} из ${slides.length}`
                : 'Плейсхолдер ленты'}
            </Text>
          </div>
          <Card.Title>
            {posts.some((post) => post.isPinned)
              ? 'Закрепленные публикации'
              : 'Свежие публикации'}
          </Card.Title>
          <Card.Description>
            {posts.length > 0
              ? 'Перелистывайте важные посты сервера и открывайте публикацию в один клик.'
              : 'Как только команда опубликует первые материалы, они появятся здесь.'}
          </Card.Description>
        </div>

        <div className="flex items-center gap-2">
          <Button
            aria-label="Предыдущий пост"
            isDisabled={slides.length < 2}
            isIconOnly
            variant="secondary"
            onPress={showPrev}
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            aria-label="Следующий пост"
            isDisabled={slides.length < 2}
            isIconOnly
            variant="secondary"
            onPress={showNext}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </Card.Header>

      <Card.Content className="grid gap-5 p-6 pt-0">
        <div
          className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10"
          style={getCoverBackground(currentSlide)}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.78))]" />
          <div className="relative flex min-h-[320px] flex-col justify-end gap-4 p-6 text-white md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Chip color={currentSlide.isPinned ? 'warning' : 'accent'} variant="soft">
                {currentSlide.isPinned ? 'Закрепленный пост' : 'Публикация'}
              </Chip>
              <Text className="text-white/80" type="body-sm">
                {formatDate(currentSlide.publishedAt)}
              </Text>
            </div>
            <div className="grid max-w-3xl gap-3">
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                {currentSlide.title}
              </h2>
              <Text className="max-w-2xl text-white/80" type="body">
                {currentSlide.summary}
              </Text>
            </div>
            {currentSlide.slug ? (
              <div className="flex flex-wrap gap-3">
                <HeroLinkButton
                  to={`${basePath}/${currentSlide.slug}`}
                  variant="secondary"
                >
                  Открыть пост
                </HeroLinkButton>
              </div>
            ) : null}
          </div>
        </div>

        {slides.length > 1 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {slides.map((post, index) => (
              <button
                key={post.id}
                className={[
                  'grid gap-2 rounded-2xl border px-4 py-3 text-left transition-colors',
                  index === currentIndex
                    ? 'border-[var(--accent)] bg-[var(--surface-secondary)]'
                    : 'border-[var(--separator)] bg-[var(--surface)] hover:bg-[var(--surface-secondary)]',
                ].join(' ')}
                type="button"
                onClick={() => setCurrentIndex(index)}
              >
                <Text type="body-sm">{post.title}</Text>
                <Text color="muted" type="body-sm">
                  {formatDate(post.publishedAt)}
                </Text>
              </button>
            ))}
          </div>
        ) : null}
      </Card.Content>
    </Card>
  )
}
