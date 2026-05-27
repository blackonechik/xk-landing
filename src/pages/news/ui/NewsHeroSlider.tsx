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
    return ''
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

function getPostRoute(basePath: '/news' | '/cabinet/news') {
  return basePath === '/cabinet/news' ? '/cabinet/news/$slug' : '/news/$slug'
}

export function NewsHeroSlider({ basePath, posts }: NewsHeroSliderProps) {
  const slides = posts.length > 0 ? posts : placeholderSlides
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSlide = slides[currentIndex] ?? slides[0]
  const hasPinnedPosts = posts.some((post) => post.isPinned)
  const postRoute = getPostRoute(basePath)

  function showPrev() {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  function showNext() {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <Card className="overflow-hidden p-0 border border-[var(--separator)] bg-[var(--surface)]">
      <Card.Content className="grid gap-5">
        <div
          className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10"
          style={getCoverBackground(currentSlide)}
        >
          <div className="absolute left-4 right-4 top-4 z-10 flex items-start justify-between gap-3 md:left-6 md:right-6 md:top-6">
            <div className="flex flex-wrap items-center gap-3">
              {posts.length > 0 ? (
                <Text className="text-white/80" type="body-sm">
                  {currentIndex + 1} из {slides.length}
                </Text>
              ) : null}
            </div>
          </div>
          <Button
            aria-label="Предыдущий пост"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-inherit"
            isDisabled={slides.length < 2}
            isIconOnly
            variant="danger"
            onPress={showPrev}
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            aria-label="Следующий пост"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-inherit"
            isDisabled={slides.length < 2}
            isIconOnly
            variant="danger"
            onPress={showNext}
          >
            <ChevronRight size={18} />
          </Button>
          <div className="relative flex min-h-[450px] flex-col justify-between gap-4 p-6 text-white md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Chip color={currentSlide.isPinned ? 'warning' : 'accent'} variant="soft">
                {currentSlide.isPinned ? 'Закрепленный пост' : 'Новости'}
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
                  params={{ slug: currentSlide.slug }}
                  to={postRoute}
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
