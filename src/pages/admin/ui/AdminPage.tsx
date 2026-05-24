import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Button,
  Card,
  Chip,
  Input,
  Spinner,
  Switch,
  Text,
} from '@heroui/react'
import {
  FileText,
  ReceiptText,
  ShieldCheck,
  TicketPercent,
  Wallet,
} from 'lucide-react'
import {
  createPromoCode,
  createAdminPost,
  deleteAdminWhitelistEntry,
  fetchAdminDashboard,
  fetchPromoCodes,
  updateAdminApplication,
  updateAdminNavigation,
  updateAdminPlayerBlocked,
  updateAdminPost,
  updatePromoCode,
} from '../model/api'
import type {
  AdminApplicationRow,
  AdminDashboard,
  AdminPlayerRow,
  AdminPostRow,
  AdminPromoCodeRow,
  AdminWhitelistRow,
} from '../model/api'
import {
  fetchAccountCached,
  getCachedAccount,
  logout,
  type AccountPayload,
} from '@/entities/account'
import { clearSiteSettingsCache } from '@/entities/site'
import { AccountLayout } from '@/widgets/account/layout'
import { HeroLinkButton, HeroMetricCard, HeroPage } from '@/shared/ui/hero-page'
import type { AdminView } from '@/widgets/account/sidebar/model/account-sidebar-menu'

const paymentStatusMeta: Record<
  string,
  { label: string; color: 'success' | 'warning' | 'danger' | 'default' | 'accent' }
> = {
  paid: { label: 'Оплачено', color: 'success' },
  pending: { label: 'Ожидает оплату', color: 'warning' },
  failed: { label: 'Ошибка оплаты', color: 'danger' },
  canceled: { label: 'Отменено', color: 'default' },
}

const applicationStatusMeta: Record<
  string,
  { label: string; color: 'success' | 'warning' | 'danger' | 'default' | 'accent' }
> = {
  new: { label: 'Новая', color: 'accent' },
  review: { label: 'На рассмотрении', color: 'warning' },
  accepted: { label: 'Принята', color: 'success' },
  rejected: { label: 'Отклонена', color: 'danger' },
}

const promoStatusMeta = {
  active: { label: 'Активен', color: 'success' as const },
  disabled: { label: 'Выключен', color: 'default' as const },
}

function getPaymentStatusMeta(status: string) {
  return paymentStatusMeta[status] ?? { label: status, color: 'default' as const }
}

function getApplicationStatusMeta(status: string) {
  return applicationStatusMeta[status] ?? { label: status, color: 'default' as const }
}

function getPromoStatusMeta(isActive: boolean) {
  return isActive ? promoStatusMeta.active : promoStatusMeta.disabled
}

function formatDate(value: string | null) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date)
}

function parseOptionalPositiveInt(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = Number(trimmed)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined
  }

  return parsed
}

function formatPromoDiscount(promo: AdminPromoCodeRow) {
  return promo.discountType === 'percent' ? `${promo.discountValue}%` : `${promo.discountValue} руб.`
}

export function AdminPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountPayload | null>(() => getCachedAccount())
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [promoCodes, setPromoCodes] = useState<AdminPromoCodeRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingPromo, setIsSavingPromo] = useState(false)
  const [isSavingPost, setIsSavingPost] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [error, setError] = useState('')
  const [selectedTab, setSelectedTab] = useState<AdminView>('overview')
  const [promoCode, setPromoCode] = useState('')
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent')
  const [discountValue, setDiscountValue] = useState('10')
  const [maxUses, setMaxUses] = useState('')
  const [maxUsesPerNickname, setMaxUsesPerNickname] = useState('1')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [postId, setPostId] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [postSlug, setPostSlug] = useState('')
  const [postSummary, setPostSummary] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postAuthorName, setPostAuthorName] = useState('')
  const [postCoverTone, setPostCoverTone] = useState('slate')
  const [postPublished, setPostPublished] = useState(true)
  const [applicationNotes, setApplicationNotes] = useState<Record<string, string>>({})

  const isSessionAdmin = account?.player.siteRole === 'admin'

  useEffect(() => {
    let isActive = true

    void fetchAccountCached()
      .then((payload) => {
        if (isActive) {
          setAccount(payload)
        }
      })
      .catch(() => {
        if (isActive) {
          setAccount(null)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (isSessionAdmin) {
      void loadDashboard()
    }
  }, [isSessionAdmin])

  const stats = useMemo(() => {
    const payments = dashboard?.payments ?? []
    const paidCount = payments.filter((item) => item.status === 'paid').length
    const pendingCount = payments.filter((item) => item.status === 'pending').length

    return {
      totalPayments: payments.length,
      paidCount,
      pendingCount,
      totalLifeLogs: dashboard?.lifeLogs.length ?? 0,
      totalPromoCodes: promoCodes.length,
      activePromoCodes: promoCodes.filter((item) => item.isActive).length,
      totalApplications: dashboard?.applications.length ?? 0,
      pendingApplications: dashboard?.applications.filter((item) => item.status === 'new').length ?? 0,
      totalPosts: dashboard?.posts.length ?? 0,
      publishedPosts: dashboard?.posts.filter((item) => item.isPublished).length ?? 0,
      totalPlayers: dashboard?.players.length ?? 0,
      blockedPlayers: dashboard?.players.filter((item) => item.blocked).length ?? 0,
      totalWhitelist: dashboard?.whitelist.length ?? 0,
    }
  }, [dashboard, promoCodes])

  async function loadDashboard() {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const [dashboardData, promoData] = await Promise.all([
        fetchAdminDashboard(),
        fetchPromoCodes(),
      ])

      setDashboard(dashboardData)
      setPromoCodes(promoData)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка загрузки данных.')
      setDashboard(null)
      setPromoCodes([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreatePromo() {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    const normalizedCode = promoCode.trim().toUpperCase()

    if (!normalizedCode) {
      setError('Введите код промокода.')
      return
    }

    const parsedDiscountValue = parseOptionalPositiveInt(discountValue)

    if (!parsedDiscountValue) {
      setError('discountValue должен быть целым числом больше 0.')
      return
    }

    const parsedMaxUses = parseOptionalPositiveInt(maxUses)
    if (maxUses.trim() && !parsedMaxUses) {
      setError('maxUses должен быть целым числом больше 0.')
      return
    }

    const parsedMaxUsesPerNickname = parseOptionalPositiveInt(maxUsesPerNickname)
    if (maxUsesPerNickname.trim() && !parsedMaxUsesPerNickname) {
      setError('maxUsesPerNickname должен быть целым числом больше 0.')
      return
    }

    setError('')
    setIsSavingPromo(true)

    try {
      const promo = await createPromoCode({
        code: normalizedCode,
        discountType,
        discountValue: parsedDiscountValue,
        maxUses: parsedMaxUses,
        maxUsesPerNickname: parsedMaxUsesPerNickname,
        startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      })

      setPromoCodes((prev) => [promo, ...prev])
      setPromoCode('')
      setDiscountType('percent')
      setDiscountValue('10')
      setMaxUses('')
      setMaxUsesPerNickname('1')
      setStartsAt('')
      setEndsAt('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось создать промокод.')
    } finally {
      setIsSavingPromo(false)
    }
  }

  async function handleTogglePromoActive(promo: AdminPromoCodeRow) {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    setError('')

    try {
      const updated = await updatePromoCode(promo.id, {
        isActive: !promo.isActive,
      })

      setPromoCodes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось обновить промокод.')
    }
  }

  async function handleUpdateApplication(application: AdminApplicationRow, status: string) {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    try {
      const updated = await updateAdminApplication(application.id, {
        status,
        reviewNote: applicationNotes[application.id] ?? application.reviewNote,
        reviewedBy: account?.player.nickname ?? 'admin',
      })

      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              applications: prev.applications.map((item) =>
                item.id === updated.id ? updated : item,
              ),
            }
          : prev,
      )
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось обновить заявку.')
    }
  }

  async function handleSavePost() {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    if (!postTitle.trim() || !postSummary.trim() || !postContent.trim()) {
      setError('Заполните заголовок, краткое описание и содержимое поста.')
      return
    }

    setError('')
    setIsSavingPost(true)

    try {
      const payload = {
        slug: postSlug.trim() || undefined,
        title: postTitle.trim(),
        summary: postSummary.trim(),
        content: postContent.trim(),
        coverTone: postCoverTone.trim(),
        isPublished: postPublished,
        authorName: postAuthorName.trim() || account?.player.nickname || null,
      }

      const saved = postId
        ? await updateAdminPost(postId, payload)
        : await createAdminPost(payload)

      setDashboard((prev) => {
        if (!prev) {
          return prev
        }

        const nextPosts = postId
          ? prev.posts.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...prev.posts]

        return {
          ...prev,
          posts: nextPosts,
        }
      })

      resetPostForm()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось сохранить пост.')
    } finally {
      setIsSavingPost(false)
    }
  }

  function resetPostForm() {
    setPostId('')
    setPostTitle('')
    setPostSlug('')
    setPostSummary('')
    setPostContent('')
    setPostAuthorName('')
    setPostCoverTone('slate')
    setPostPublished(true)
  }

  function editPost(post: AdminPostRow) {
    setPostId(post.id)
      setPostTitle(post.title)
    setPostSlug(post.slug)
    setPostSummary(post.summary)
    setPostContent(post.content)
    setPostAuthorName(post.authorName ?? '')
    setPostCoverTone(post.coverTone)
    setPostPublished(post.isPublished)
    setSelectedTab('posts')
  }

  async function handleToggleBankVisibility(nextValue: boolean) {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    setIsSavingSettings(true)

    try {
      const settings = await updateAdminNavigation(nextValue)
      clearSiteSettingsCache()
      setDashboard((prev) => (prev ? { ...prev, settings } : prev))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось обновить настройки навигации.')
    } finally {
      setIsSavingSettings(false)
    }
  }

  async function handleTogglePlayerBlocked(player: AdminPlayerRow) {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    try {
      await updateAdminPlayerBlocked(player.lowercaseNickname, !player.blocked)
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              players: prev.players.map((item) =>
                item.lowercaseNickname === player.lowercaseNickname
                  ? { ...item, blocked: !item.blocked }
                  : item,
              ),
            }
          : prev,
      )
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось изменить статус игрока.')
    }
  }

  async function handleDeleteWhitelistEntry(entry: AdminWhitelistRow) {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    try {
      await deleteAdminWhitelistEntry(entry.nickname)
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              whitelist: prev.whitelist.filter((item) => item.nickname !== entry.nickname),
            }
          : prev,
      )
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось удалить игрока из whitelist.')
    }
  }

  const content = (
    <div className="grid gap-6">
      {error ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HeroMetricCard
          icon={<Wallet size={18} />}
          label="Платежи"
          value={stats.totalPayments}
          description={`${stats.paidCount} оплачено, ${stats.pendingCount} ожидают`}
        />
        <HeroMetricCard
          icon={<ShieldCheck size={18} />}
          label="Заявки"
          value={stats.totalApplications}
          description={`${stats.pendingApplications} новых`}
        />
        <HeroMetricCard
          icon={<FileText size={18} />}
          label="Посты"
          value={stats.totalPosts}
          description={`${stats.publishedPosts} опубликовано`}
        />
        <HeroMetricCard
          icon={<TicketPercent size={18} />}
          label="Whitelist"
          value={stats.totalWhitelist}
          description={`${stats.blockedPlayers} игроков заблокировано`}
        />
      </div>

      {selectedTab === 'overview' ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <Card.Header>
              <Card.Title>Сводка</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4 sm:grid-cols-2">
              <HeroMetricCard label="Оплачено" value={stats.paidCount} />
              <HeroMetricCard label="В ожидании" value={stats.pendingCount} />
              <HeroMetricCard label="Логов жизней" value={stats.totalLifeLogs} />
              <HeroMetricCard label="Активных промокодов" value={stats.activePromoCodes} />
              <HeroMetricCard label="Новых заявок" value={stats.pendingApplications} />
              <HeroMetricCard label="Опубликованных постов" value={stats.publishedPosts} />
              <HeroMetricCard label="Заблокированных игроков" value={stats.blockedPlayers} />
              <HeroMetricCard label="В whitelist" value={stats.totalWhitelist} />
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Последние платежи</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-3">
              {(dashboard?.payments ?? []).slice(0, 8).map((payment) => (
                <div key={payment.id} className="flex items-start justify-between gap-4 rounded-xl border border-default-200 p-3">
                  <div>
                    <Text type="body-sm">{payment.nickname}</Text>
                    <Text color="muted" type="body-sm">{payment.productName}</Text>
                  </div>
                  <div className="text-right">
                    <Chip
                      color={getPaymentStatusMeta(payment.status).color}
                      variant="soft"
                    >
                      {getPaymentStatusMeta(payment.status).label}
                    </Chip>
                    <Text color="muted" type="body-sm">{payment.amountRub} руб.</Text>
                  </div>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      ) : null}

      {selectedTab === 'applications' ? (
        <div className="grid gap-4">
          {(dashboard?.applications ?? []).map((application) => (
            <Card key={application.id}>
              <Card.Header className="flex items-start justify-between gap-4">
                <div>
                  <Card.Title>{application.nickname}</Card.Title>
                  <Card.Description>{application.telegram} • {application.discord} • {application.age} лет</Card.Description>
                </div>
                <Chip
                  color={getApplicationStatusMeta(application.status).color}
                  variant="soft"
                >
                  {getApplicationStatusMeta(application.status).label}
                </Chip>
              </Card.Header>
              <Card.Content className="grid gap-4">
                <Text type="body-sm">Контакт: {application.contact}</Text>
                <Text type="body-sm">Планы: {application.serverPlans}</Text>
                <label className="grid gap-2">
                  <Text color="muted" type="body-sm">Комментарий администрации</Text>
                  <textarea
                    className="min-h-24 rounded-[calc(var(--radius-lg)-2px)] border border-default-200 bg-content1 px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                    value={applicationNotes[application.id] ?? application.reviewNote ?? ''}
                    onChange={(event) =>
                      setApplicationNotes((prev) => ({
                        ...prev,
                        [application.id]: event.target.value,
                      }))
                    }
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onPress={() => void handleUpdateApplication(application, 'review')}>На рассмотрении</Button>
                  <Button size="sm" color="success" onPress={() => void handleUpdateApplication(application, 'accepted')}>Принять</Button>
                  <Button size="sm" color="danger" onPress={() => void handleUpdateApplication(application, 'rejected')}>Отклонить</Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : null}

      {selectedTab === 'posts' ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card>
            <Card.Header>
              <Card.Title>{postId ? 'Редактирование поста' : 'Новый пост'}</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4">
              <Input label="Заголовок" value={postTitle} onChange={(event) => setPostTitle(event.target.value)} />
              <Input label="Slug" value={postSlug} onChange={(event) => setPostSlug(event.target.value)} placeholder="оставьте пустым для автогенерации" />
              <Input label="Краткое описание" value={postSummary} onChange={(event) => setPostSummary(event.target.value)} />
              <Input label="Автор" value={postAuthorName} onChange={(event) => setPostAuthorName(event.target.value)} />
              <Input label="Тон обложки" value={postCoverTone} onChange={(event) => setPostCoverTone(event.target.value)} placeholder="slate, amber, emerald..." />
              <label className="grid gap-2">
                <Text color="muted" type="body-sm">Текст поста</Text>
                <textarea
                  className="min-h-48 rounded-[calc(var(--radius-lg)-2px)] border border-default-200 bg-content1 px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                  value={postContent}
                  onChange={(event) => setPostContent(event.target.value)}
                />
              </label>
              <Switch isSelected={postPublished} onValueChange={setPostPublished}>
                Публиковать сразу
              </Switch>
              <div className="flex flex-wrap gap-2">
                <Button onPress={() => void handleSavePost()} isDisabled={isSavingPost}>
                  {isSavingPost ? <Spinner color="current" size="sm" /> : postId ? 'Сохранить пост' : 'Создать пост'}
                </Button>
                {postId ? <Button variant="ghost" onPress={resetPostForm}>Сбросить</Button> : null}
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Список постов</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-3">
              {(dashboard?.posts ?? []).map((post) => (
                <div key={post.id} className="grid gap-3 rounded-xl border border-default-200 p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Text type="body-sm">{post.title}</Text>
                      <Text color="muted" type="body-sm">/{post.slug}</Text>
                    </div>
                    <Chip variant="soft">{post.isPublished ? 'Опубликован' : 'Черновик'}</Chip>
                  </div>
                  <Text color="muted" type="body-sm">{post.summary}</Text>
                  <Button size="sm" variant="ghost" onPress={() => editPost(post)}>Редактировать</Button>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      ) : null}

      {selectedTab === 'navigation' ? (
        <Card>
          <Card.Header>
            <Card.Title>Навигация сайта</Card.Title>
            <Card.Description>Можно временно скрывать разделы из кабинета игроков.</Card.Description>
          </Card.Header>
          <Card.Content>
            <Switch
              isDisabled={isSavingSettings}
              isSelected={dashboard?.settings.navigation.showBank ?? true}
              onValueChange={(value) => {
                void handleToggleBankVisibility(value)
              }}
            >
              Показывать банк игрокам
            </Switch>
          </Card.Content>
        </Card>
      ) : null}

      {selectedTab === 'users' ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {(dashboard?.players ?? []).map((player) => (
            <Card key={player.lowercaseNickname}>
              <Card.Header className="flex items-start justify-between gap-4">
                <div>
                  <Card.Title>{player.nickname}</Card.Title>
                  <Card.Description>{player.discordId}</Card.Description>
                </div>
                <Chip color={player.blocked ? 'danger' : 'success'} variant="soft">
                  {player.blocked ? 'Заблокирован' : 'Активен'}
                </Chip>
              </Card.Header>
              <Card.Content className="grid gap-3">
                <Text color="muted" type="body-sm">Последний вход: {formatDate(player.lastLoginAt)}</Text>
                <Text color="muted" type="body-sm">Регистрация: {formatDate(player.registeredAt)}</Text>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    color={player.blocked ? 'success' : 'danger'}
                    onPress={() => void handleTogglePlayerBlocked(player)}
                  >
                    {player.blocked ? 'Разблокировать' : 'Заблокировать'}
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : null}

      {selectedTab === 'payments' ? (
        <div className="grid gap-4">
          {(dashboard?.payments ?? []).map((payment) => (
            <Card key={payment.id}>
              <Card.Header className="flex items-start justify-between gap-4">
                <div>
                  <Card.Title>{payment.nickname}</Card.Title>
                  <Card.Description>{payment.productName}</Card.Description>
                </div>
                <Chip
                  color={getPaymentStatusMeta(payment.status).color}
                  variant="soft"
                >
                  {getPaymentStatusMeta(payment.status).label}
                </Chip>
              </Card.Header>
              <Card.Content className="grid gap-2 md:grid-cols-2">
                <Text color="muted" type="body-sm">Сумма: {payment.amountRub} руб.</Text>
                <Text color="muted" type="body-sm">Провайдер: {payment.provider}</Text>
                <Text color="muted" type="body-sm">Создан: {formatDate(payment.createdAt)}</Text>
                <Text color="muted" type="body-sm">Обновлён: {formatDate(payment.updatedAt)}</Text>
                <Text color="muted" type="body-sm">ID платежа: {payment.id}</Text>
                <Text color="muted" type="body-sm">Provider payment ID: {payment.providerPaymentId ?? '—'}</Text>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : null}

      {selectedTab === 'whitelist' ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {(dashboard?.whitelist ?? []).map((entry) => (
            <Card key={entry.nickname}>
              <Card.Header className="flex items-start justify-between gap-4">
                <div>
                  <Card.Title>{entry.nickname}</Card.Title>
                  <Card.Description>{entry.source ?? 'Источник не указан'}</Card.Description>
                </div>
                <Chip color={entry.active ? 'success' : 'default'} variant="soft">
                  {entry.active ? 'В whitelist' : 'Неактивен'}
                </Chip>
              </Card.Header>
              <Card.Content className="grid gap-3">
                <Text color="muted" type="body-sm">Покупка: {entry.purchaseId ?? '—'}</Text>
                <Text color="muted" type="body-sm">Добавлен: {formatDate(entry.createdAt)}</Text>
                <Text color="muted" type="body-sm">Обновлён: {formatDate(entry.updatedAt)}</Text>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" color="danger" onPress={() => void handleDeleteWhitelistEntry(entry)}>
                    Удалить из whitelist
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : null}

      {selectedTab === 'promos' ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <Card.Header>
              <Card.Title>Создать промокод</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4">
              <Input label="Код" value={promoCode} onChange={(event) => setPromoCode(event.target.value.toUpperCase())} placeholder="WELCOME10" />
              <Input label="Тип скидки" value={discountType} onChange={(event) => setDiscountType(event.target.value as 'percent' | 'fixed')} placeholder="percent или fixed" />
              <Input label="Значение скидки" value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} />
              <Input label="Лимит использований" value={maxUses} onChange={(event) => setMaxUses(event.target.value)} />
              <Input label="Лимит на ник" value={maxUsesPerNickname} onChange={(event) => setMaxUsesPerNickname(event.target.value)} />
              <Input label="Активен с" type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
              <Input label="Активен до" type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
              <Button onPress={() => void handleCreatePromo()} isDisabled={isSavingPromo}>
                {isSavingPromo ? <Spinner color="current" size="sm" /> : 'Создать промокод'}
              </Button>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Промокоды</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-3">
              {promoCodes.map((row) => (
                <div key={row.id} className="grid gap-3 rounded-xl border border-default-200 p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Text type="body-sm">{row.code}</Text>
                      <Text color="muted" type="body-sm">{formatPromoDiscount(row)}</Text>
                    </div>
                    <Chip
                      color={getPromoStatusMeta(row.isActive).color}
                      variant="soft"
                    >
                      {getPromoStatusMeta(row.isActive).label}
                    </Chip>
                  </div>
                  <Text color="muted" type="body-sm">Лимит: {row.maxUses ?? '—'} / На ник: {row.maxUsesPerNickname ?? '—'} / Использовано: {row.usedCount}</Text>
                  <Button size="sm" variant="ghost" onPress={() => void handleTogglePromoActive(row)}>
                    {row.isActive ? 'Отключить' : 'Включить'}
                  </Button>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      ) : null}
    </div>
  )

  if (account) {
    return (
      <AccountLayout
        account={account}
        activeAdminView={selectedTab}
        currentSection="admin"
        onNavigate={(to) => {
          void navigate({ to })
        }}
        onAdminViewNavigate={setSelectedTab}
        onBankViewNavigate={(view) => {
          void navigate({ to: `/cabinet/bank/${view}` })
        }}
        eyebrow="Администрирование"
        title="Админка"
        description="Заявки, посты, пользователи, навигация и платежные данные сайта."
        actions={
          <>
            <HeroLinkButton to="/news" variant="secondary">Открыть ленту</HeroLinkButton>
            <HeroLinkButton to="/cabinet" variant="secondary">К кабинету</HeroLinkButton>
            <Button
              variant="ghost"
              onPress={() => {
                void logout().then(() => navigate({ to: '/' }))
              }}
            >
              Выйти
            </Button>
          </>
        }
      >
        {content}
      </AccountLayout>
    )
  }

  return (
    <HeroPage
      eyebrow="Администрирование"
      title="Админка XK HARDCORE"
      description="Доступ к админке есть только у пользователей с ролью администратора сайта."
      narrow
    >
      {content}
    </HeroPage>
  )
}
