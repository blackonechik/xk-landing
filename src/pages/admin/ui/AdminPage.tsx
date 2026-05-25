import { useEffect, useMemo, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import {
  Alert,
  AlertDialog,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Chip,
  Description,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  Spinner,
  Switch,
  Table,
  Text,
  TextField,
  toast,
} from '@heroui/react'
import {
  CheckCircle2,
  FileText,
  Info,
  ShieldCheck,
  TicketPercent,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import {
  createAdminWhitelistEntry,
  createPromoCode,
  createAdminPost,
  deleteAdminWhitelistEntry,
  fetchAdminDashboard,
  fetchPromoCodes,
  updateAdminApplication,
  updateAdminNavigation,
  updateAdminPlayerBlocked,
  updateAdminPlayerRoles,
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
import { fetchAccountCached, getCachedAccount, logout } from '@/entities/account'
import type { AccountPayload } from '@/entities/account'
import { clearSiteSettingsCache } from '@/entities/site'
import type {
  SiteNavigationIconKey,
  SiteNavigationItem,
  SiteNavigationRole,
} from '@/entities/site'
import { AccountLayout } from '@/widgets/account/layout'
import { HeroLinkButton, HeroMetricCard, HeroPage } from '@/shared/ui/hero-page'
import { LexicalRichTextEditor } from '@/shared/ui/rich-text-editor'
import {
  defaultSiteNavigationItems,
  getAdminViewFromPathname,
  getAdminViewPath,
  getNavigationIcon,
  navigationIconOptions,
} from '@/widgets/account/sidebar/model/account-sidebar-menu'
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

const postModerationStatusMeta: Record<
  string,
  { label: string; color: 'success' | 'warning' | 'danger' | 'default' | 'accent' }
> = {
  pending: { label: 'На модерации', color: 'warning' },
  approved: { label: 'Одобрен', color: 'success' },
  rejected: { label: 'Отклонен', color: 'danger' },
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

function getPostModerationStatusMeta(status: string) {
  return postModerationStatusMeta[status] ?? { label: status, color: 'default' as const }
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

function renderTableEmptyState(message: string) {
  return () => (
    <div className="px-4 py-6 text-sm text-muted">
      {message}
    </div>
  )
}

function AdminTableCard({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <Card>
      <Card.Header className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <Card.Title>{title}</Card.Title>
          {description ? <Card.Description>{description}</Card.Description> : null}
        </div>
        {action}
      </Card.Header>
      <Card.Content>{children}</Card.Content>
    </Card>
  )
}

function getButtonToneClass(
  tone: 'default' | 'danger' | 'success' | 'warning' | 'accent' = 'default',
) {
  switch (tone) {
    case 'danger':
      return 'bg-danger text-danger-foreground hover:bg-danger/90'
    case 'success':
      return 'bg-success text-success-foreground hover:bg-success/90'
    case 'warning':
      return 'bg-warning text-warning-foreground hover:bg-warning/90'
    case 'accent':
      return 'bg-accent text-accent-foreground hover:bg-accent/90'
    default:
      return ''
  }
}

function LabeledInput({
  label,
  description,
  name,
  ...inputProps
}: {
  label: string
  description?: string
  name?: string
} & ComponentProps<typeof Input>) {
  return (
    <TextField className="grid gap-2" name={name}>
      <Label>{label}</Label>
      <Input {...inputProps} aria-label={inputProps['aria-label'] ?? label} />
      {description ? <Description>{description}</Description> : null}
    </TextField>
  )
}

type ConfirmationState = {
  title: string
  description: string
  confirmLabel: string
  confirmColor?: 'default' | 'danger' | 'success' | 'warning' | 'accent'
  onConfirm: () => void | Promise<void>
} | null

type NavigationEditorState = {
  key: SiteNavigationItem['key']
  label: string
  icon: SiteNavigationIconKey
  audiences: SiteNavigationRole[]
} | null

type PlayerRolesEditorState = {
  player: AdminPlayerRow
  roles: string[]
} | null

const navigationRoleOptions: { value: SiteNavigationRole; label: string }[] = [
  { value: 'player', label: 'Игроки' },
  { value: 'moderator', label: 'Модераторы' },
  { value: 'admin', label: 'Админы' },
]

const playerRoleOptions = [
  { value: 'player', label: 'Игрок' },
  { value: 'moderator', label: 'Модератор' },
  { value: 'admin', label: 'Админ' },
]

function normalizePostContentHtml(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed
  }

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('')
}

export function AdminPage() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [account, setAccount] = useState<AccountPayload | null>(() => getCachedAccount())
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [promoCodes, setPromoCodes] = useState<AdminPromoCodeRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingPromo, setIsSavingPromo] = useState(false)
  const [isSavingPost, setIsSavingPost] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [error, setError] = useState('')
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
  const [postCoverImageUrl, setPostCoverImageUrl] = useState('')
  const [postSubmittedByNickname, setPostSubmittedByNickname] = useState('')
  const [postModerationStatus, setPostModerationStatus] = useState('approved')
  const [postReviewNote, setPostReviewNote] = useState('')
  const [postPinned, setPostPinned] = useState(false)
  const [postPinnedOrder, setPostPinnedOrder] = useState('')
  const [postPublished, setPostPublished] = useState(true)
  const [applicationNotes, setApplicationNotes] = useState<Record<string, string>>({})
  const [confirmState, setConfirmState] = useState<ConfirmationState>(null)
  const [navigationEditor, setNavigationEditor] = useState<NavigationEditorState>(null)
  const [playerRolesEditor, setPlayerRolesEditor] =
    useState<PlayerRolesEditorState>(null)
  const [isSavingPlayerRoles, setIsSavingPlayerRoles] = useState(false)
  const [isWhitelistEditorOpen, setIsWhitelistEditorOpen] = useState(false)
  const [whitelistNickname, setWhitelistNickname] = useState('')
  const [isSavingWhitelist, setIsSavingWhitelist] = useState(false)

  const isSessionAdmin = account?.player.siteRole === 'admin'
  const selectedTab: AdminView = getAdminViewFromPathname(pathname)

  function showErrorToast(message: string, description?: string) {
    toast.danger(message, {
      description,
      indicator: <TriangleAlert size={16} />,
    })
  }

  function showSuccessToast(message: string, description?: string) {
    toast.success(message, {
      description,
      indicator: <CheckCircle2 size={16} />,
    })
  }

  function showInfoToast(message: string, description?: string) {
    toast.info(message, {
      description,
      indicator: <Info size={16} />,
    })
  }

  function requestConfirmation(nextState: ConfirmationState) {
    setConfirmState(nextState)
  }

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
    if (pathname === '/cabinet/admin') {
      void navigate({ replace: true, to: getAdminViewPath('overview') })
    }
  }, [navigate, pathname])

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

  const navigationItems = useMemo(
    () =>
      (dashboard?.settings.navigation.items.length
        ? [...dashboard.settings.navigation.items]
        : [...defaultSiteNavigationItems]
      ).sort((left, right) => left.order - right.order),
    [dashboard?.settings.navigation.items],
  )

  async function loadDashboard() {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
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
      const message = requestError instanceof Error ? requestError.message : 'Ошибка загрузки данных.'
      setError(message)
      showErrorToast('Не удалось загрузить админку', message)
      setDashboard(null)
      setPromoCodes([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreatePromo() {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    const normalizedCode = promoCode.trim().toUpperCase()

    if (!normalizedCode) {
      showInfoToast('Введите код промокода')
      return
    }

    const parsedDiscountValue = parseOptionalPositiveInt(discountValue)

    if (!parsedDiscountValue) {
      showInfoToast('Значение скидки должно быть целым числом больше 0')
      return
    }

    const parsedMaxUses = parseOptionalPositiveInt(maxUses)
    if (maxUses.trim() && !parsedMaxUses) {
      showInfoToast('Лимит использований должен быть целым числом больше 0')
      return
    }

    const parsedMaxUsesPerNickname = parseOptionalPositiveInt(maxUsesPerNickname)
    if (maxUsesPerNickname.trim() && !parsedMaxUsesPerNickname) {
      showInfoToast('Лимит на ник должен быть целым числом больше 0')
      return
    }
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
      showSuccessToast('Промокод создан', `Код ${promo.code} добавлен в систему.`)
    } catch (requestError) {
      showErrorToast(
        'Не удалось создать промокод',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingPromo(false)
    }
  }

  async function handleTogglePromoActive(promo: AdminPromoCodeRow) {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    try {
      const updated = await updatePromoCode(promo.id, {
        isActive: !promo.isActive,
      })

      setPromoCodes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      showSuccessToast(
        updated.isActive ? 'Промокод включен' : 'Промокод отключен',
        `Код ${updated.code} обновлен.`,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить промокод',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  async function handleUpdateApplication(application: AdminApplicationRow, status: string) {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    try {
      const updated = await updateAdminApplication(application.id, {
        status,
        reviewNote:
          applicationNotes[application.id] !== undefined
            ? applicationNotes[application.id]
            : application.reviewNote,
        reviewedBy: account.player.nickname,
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
      showSuccessToast(
        'Статус заявки обновлен',
        `${application.nickname}: ${getApplicationStatusMeta(updated.status).label}.`,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить заявку',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  async function handleSavePost() {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    const normalizedContent = normalizePostContentHtml(postContent)

    if (!postTitle.trim() || !postSummary.trim() || !normalizedContent.trim()) {
      showInfoToast('Заполните заголовок, краткое описание и содержимое поста')
      return
    }
    setIsSavingPost(true)

    try {
      const payload = {
        slug: postSlug.trim() || undefined,
        title: postTitle.trim(),
        summary: postSummary.trim(),
        content: normalizedContent.trim(),
        coverTone: postCoverTone.trim(),
        coverImageUrl: postCoverImageUrl.trim() || null,
        submittedByNickname: postSubmittedByNickname.trim() || null,
        moderationStatus: postModerationStatus,
        reviewedBy:
          postModerationStatus === 'pending'
            ? null
            : account.player.nickname,
        reviewNote: postReviewNote.trim() || null,
        isPinned: postPinned,
        pinnedOrder:
          postPinned && postPinnedOrder.trim()
            ? Number(postPinnedOrder.trim()) || null
            : null,
        isPublished: postPublished,
        authorName: postAuthorName.trim() || account.player.nickname || null,
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
      showSuccessToast(
        postId ? 'Пост обновлен' : 'Пост создан',
        `Публикация "${saved.title}" сохранена.`,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось сохранить пост',
        requestError instanceof Error ? requestError.message : undefined,
      )
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
    setPostCoverImageUrl('')
    setPostSubmittedByNickname('')
    setPostModerationStatus('approved')
    setPostReviewNote('')
    setPostPinned(false)
    setPostPinnedOrder('')
    setPostPublished(true)
  }

  function editPost(post: AdminPostRow) {
    setPostId(post.id)
    setPostTitle(post.title)
    setPostSlug(post.slug)
    setPostSummary(post.summary)
    setPostContent(normalizePostContentHtml(post.content))
    setPostAuthorName(post.authorName ?? '')
    setPostCoverTone(post.coverTone)
    setPostCoverImageUrl(post.coverImageUrl ?? '')
    setPostSubmittedByNickname(post.submittedByNickname ?? '')
    setPostModerationStatus(post.moderationStatus)
    setPostReviewNote(post.reviewNote ?? '')
    setPostPinned(post.isPinned)
    setPostPinnedOrder(
      typeof post.pinnedOrder === 'number' ? String(post.pinnedOrder) : '',
    )
    setPostPublished(post.isPublished)
    void navigate({ to: getAdminViewPath('posts') })
  }

  async function handleModeratePost(
    post: AdminPostRow,
    moderationStatus: 'approved' | 'rejected',
  ) {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    setIsSavingPost(true)

    try {
      const updated = await updateAdminPost(post.id, {
        slug: post.slug,
        title: post.title,
        summary: post.summary,
        content: normalizePostContentHtml(post.content),
        coverTone: post.coverTone,
        coverImageUrl: post.coverImageUrl,
        submittedByNickname: post.submittedByNickname,
        moderationStatus,
        reviewedBy: account.player.nickname,
        reviewNote: post.reviewNote,
        isPinned: moderationStatus === 'approved' ? post.isPinned : false,
        pinnedOrder: moderationStatus === 'approved' ? post.pinnedOrder : null,
        isPublished: moderationStatus === 'approved',
        authorName: post.authorName,
      })

      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              posts: prev.posts.map((item) =>
                item.id === updated.id ? updated : item,
              ),
            }
          : prev,
      )

      showSuccessToast(
        moderationStatus === 'approved'
          ? 'Пост одобрен'
          : 'Пост отклонен',
        updated.title,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить статус поста',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingPost(false)
    }
  }

  async function handleSaveNavigation(items: SiteNavigationItem[], successMessage: string, description?: string) {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    setIsSavingSettings(true)

    try {
      const settings = await updateAdminNavigation(items)
      clearSiteSettingsCache()
      setDashboard((prev) => (prev ? { ...prev, settings } : prev))
      showSuccessToast(successMessage, description)
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить навигацию',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingSettings(false)
    }
  }

  function openNavigationEditor(item: SiteNavigationItem) {
    setNavigationEditor({
      key: item.key,
      label: item.label,
      icon: item.icon,
      audiences: [...item.audiences],
    })
  }

  async function handleSaveNavigationEditor() {
    if (!navigationEditor) {
      return
    }

    if (!navigationEditor.label.trim()) {
      showInfoToast('Укажите название раздела')
      return
    }

    if (navigationEditor.audiences.length === 0) {
      showInfoToast('Выберите хотя бы одну группу игроков')
      return
    }

    const nextItems = navigationItems.map((item) =>
      item.key === navigationEditor.key
        ? {
            ...item,
            label: navigationEditor.label.trim(),
            icon: navigationEditor.icon,
            audiences: [...navigationEditor.audiences],
            deleted: false,
          }
        : item,
    )

    await handleSaveNavigation(nextItems, 'Навигация обновлена', `Раздел ${navigationEditor.label.trim()} сохранен.`)
    setNavigationEditor(null)
  }

  async function handleTogglePlayerBlocked(player: AdminPlayerRow) {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
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
      showSuccessToast(
        player.blocked ? 'Игрок разблокирован' : 'Игрок заблокирован',
        player.nickname,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось изменить статус игрока',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  async function handleSavePlayerRoles() {
    if (!isSessionAdmin || !playerRolesEditor) {
      return
    }

    setIsSavingPlayerRoles(true)

    try {
      const roles = await updateAdminPlayerRoles(
        playerRolesEditor.player.lowercaseNickname,
        playerRolesEditor.roles,
      )

      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              players: prev.players.map((item) =>
                item.lowercaseNickname ===
                playerRolesEditor.player.lowercaseNickname
                  ? { ...item, roles }
                  : item,
              ),
            }
          : prev,
      )
      showSuccessToast('Роли пользователя обновлены', playerRolesEditor.player.nickname)
      setPlayerRolesEditor(null)
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить роли',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingPlayerRoles(false)
    }
  }

  async function handleCreateWhitelistEntry() {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
      return
    }

    if (!whitelistNickname.trim()) {
      showInfoToast('Введите никнейм игрока')
      return
    }

    setIsSavingWhitelist(true)

    try {
      const entry = await createAdminWhitelistEntry(whitelistNickname.trim())

      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              whitelist: [
                entry,
                ...prev.whitelist.filter(
                  (item) => item.nickname.toLowerCase() !== entry.nickname.toLowerCase(),
                ),
              ],
            }
          : prev,
      )
      setWhitelistNickname('')
      setIsWhitelistEditorOpen(false)
      showSuccessToast('Игрок добавлен в whitelist', entry.nickname)
    } catch (requestError) {
      showErrorToast(
        'Не удалось добавить игрока в whitelist',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingWhitelist(false)
    }
  }

  async function handleDeleteWhitelistEntry(entry: AdminWhitelistRow) {
    if (!isSessionAdmin) {
      showErrorToast('Доступ запрещен', 'Нужен вход под пользователем с ролью администратора сайта.')
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
      showSuccessToast('Запись удалена из whitelist', entry.nickname)
    } catch (requestError) {
      showErrorToast(
        'Не удалось удалить игрока из whitelist',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  const content = (
    <div className="grid gap-6">
      {isLoading ? (
        <Alert status="accent">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Загружаем данные админки</Alert.Title>
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
          <AdminTableCard title="Сводка" description="Главные показатели по сайту и серверу.">
            <div className="grid gap-4 sm:grid-cols-2">
              <HeroMetricCard label="Оплачено" value={stats.paidCount} />
              <HeroMetricCard label="В ожидании" value={stats.pendingCount} />
              <HeroMetricCard label="Логов жизней" value={stats.totalLifeLogs} />
              <HeroMetricCard label="Активных промокодов" value={stats.activePromoCodes} />
              <HeroMetricCard label="Новых заявок" value={stats.pendingApplications} />
              <HeroMetricCard label="Опубликованных постов" value={stats.publishedPosts} />
              <HeroMetricCard label="Заблокированных игроков" value={stats.blockedPlayers} />
              <HeroMetricCard label="В whitelist" value={stats.totalWhitelist} />
            </div>
          </AdminTableCard>

          <AdminTableCard
            title="Последние платежи"
            description="Свежие покупки и изменения статусов оплаты."
          >
            <Table variant="secondary">
              <Table.ScrollContainer>
                <Table.Content aria-label="Последние платежи" className="min-w-[620px]">
                  <Table.Header>
                    <Table.Column isRowHeader>Игрок</Table.Column>
                    <Table.Column>Товар</Table.Column>
                    <Table.Column>Сумма</Table.Column>
                    <Table.Column>Статус</Table.Column>
                    <Table.Column>Обновлен</Table.Column>
                  </Table.Header>
                  <Table.Body renderEmptyState={renderTableEmptyState('Платежей пока нет.')}>
                    {(dashboard?.payments ?? []).slice(0, 8).map((payment) => (
                      <Table.Row key={payment.id} id={payment.id}>
                        <Table.Cell>{payment.nickname}</Table.Cell>
                        <Table.Cell>{payment.productName}</Table.Cell>
                        <Table.Cell>{payment.amountRub} руб.</Table.Cell>
                        <Table.Cell>
                          <Chip color={getPaymentStatusMeta(payment.status).color} variant="soft">
                            {getPaymentStatusMeta(payment.status).label}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>{formatDate(payment.updatedAt)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </AdminTableCard>
        </div>
      ) : null}

      {selectedTab === 'applications' ? (
        <AdminTableCard
          title="Заявки"
          description="Очередь вступления, контакты игроков и решения администрации."
        >
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="Заявки игроков" className="min-w-[1180px]">
                <Table.Header>
                  <Table.Column isRowHeader>Игрок</Table.Column>
                  <Table.Column>Контакты</Table.Column>
                  <Table.Column>Планы</Table.Column>
                  <Table.Column>Статус</Table.Column>
                  <Table.Column>Комментарий</Table.Column>
                  <Table.Column>Обновлено</Table.Column>
                  <Table.Column>Действия</Table.Column>
                </Table.Header>
                  <Table.Body renderEmptyState={renderTableEmptyState('Новых заявок нет.')}>
                    {(dashboard?.applications ?? []).map((application) => (
                      <Table.Row key={application.id} id={application.id}>
                      <Table.Cell>
                        <div className="grid gap-1">
                          <Text type="body-sm">{application.nickname}</Text>
                          <Text color="muted" type="body-sm">{application.age} лет</Text>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="grid gap-1 text-sm">
                          <span>{application.contact}</span>
                          <span className="text-muted">{application.telegram}</span>
                          <span className="text-muted">{application.discord}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="min-w-[240px]">
                        <Text color="muted" type="body-sm">{application.serverPlans}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Chip color={getApplicationStatusMeta(application.status).color} variant="soft">
                          {getApplicationStatusMeta(application.status).label}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell className="min-w-[260px]">
                        <textarea
                          className="min-h-24 w-full rounded-[calc(var(--radius-lg)-2px)] border border-default-200 bg-content1 px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                          value={applicationNotes[application.id] ?? application.reviewNote ?? ''}
                          onChange={(event) =>
                            setApplicationNotes((prev) => ({
                              ...prev,
                              [application.id]: event.target.value,
                            }))
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>{formatDate(application.updatedAt)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onPress={() =>
                              requestConfirmation({
                                title: 'Отправить заявку на рассмотрение?',
                                description: `Статус заявки ${application.nickname} изменится на "На рассмотрении".`,
                                confirmLabel: 'Подтвердить',
                                confirmColor: 'warning',
                                onConfirm: () => handleUpdateApplication(application, 'review'),
                              })
                            }
                          >
                            На рассмотрении
                          </Button>
                          <Button
                            className={getButtonToneClass('success')}
                            size="sm"
                            onPress={() =>
                              requestConfirmation({
                                title: 'Принять заявку?',
                                description: `Игрок ${application.nickname} будет отмечен как принятый.`,
                                confirmLabel: 'Принять',
                                confirmColor: 'success',
                                onConfirm: () => handleUpdateApplication(application, 'accepted'),
                              })
                            }
                          >
                            Принять
                          </Button>
                          <Button
                            className={getButtonToneClass('danger')}
                            size="sm"
                            onPress={() =>
                              requestConfirmation({
                                title: 'Отклонить заявку?',
                                description: `Заявка игрока ${application.nickname} будет отклонена.`,
                                confirmLabel: 'Отклонить',
                                confirmColor: 'danger',
                                onConfirm: () => handleUpdateApplication(application, 'rejected'),
                              })
                            }
                          >
                            Отклонить
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </AdminTableCard>
      ) : null}

      {selectedTab === 'posts' ? (
        <div className="grid gap-6">
          <Card>
            <Card.Header>
              <Card.Title>{postId ? 'Модерация и редактирование поста' : 'Новый пост'}</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4 xl:grid-cols-2">
              <LabeledInput label="Заголовок" value={postTitle} onChange={(event) => setPostTitle(event.target.value)} />
              <LabeledInput label="Slug" value={postSlug} onChange={(event) => setPostSlug(event.target.value)} placeholder="оставьте пустым для автогенерации" />
              <LabeledInput label="Краткое описание" value={postSummary} onChange={(event) => setPostSummary(event.target.value)} />
              <LabeledInput label="Автор" value={postAuthorName} onChange={(event) => setPostAuthorName(event.target.value)} />
              <LabeledInput label="Отправил на модерацию" value={postSubmittedByNickname} onChange={(event) => setPostSubmittedByNickname(event.target.value)} placeholder="ник игрока" />
              <LabeledInput label="Тон обложки" value={postCoverTone} onChange={(event) => setPostCoverTone(event.target.value)} placeholder="slate, amber, emerald..." />
              <LabeledInput label="Картинка обложки" value={postCoverImageUrl} onChange={(event) => setPostCoverImageUrl(event.target.value)} placeholder="https://... или /assets/..." />
              <LabeledInput label="Порядок закрепа" value={postPinnedOrder} onChange={(event) => setPostPinnedOrder(event.target.value)} placeholder="1, 2, 3..." />
              <Select
                selectedKey={postModerationStatus}
                onSelectionChange={(key) => {
                  if (typeof key === 'string') {
                    setPostModerationStatus(key)
                    if (key !== 'approved') {
                      setPostPublished(false)
                      setPostPinned(false)
                    }
                  }
                }}
              >
                <Label>Статус модерации</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="pending" textValue="На модерации">
                      На модерации
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="approved" textValue="Одобрен">
                      Одобрен
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="rejected" textValue="Отклонен">
                      Отклонен
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              <LabeledInput label="Комментарий модератора" value={postReviewNote} onChange={(event) => setPostReviewNote(event.target.value)} placeholder="опционально" />
              <div className="grid gap-3 xl:col-span-2">
                <LexicalRichTextEditor
                  label="Текст поста"
                  placeholder="Напишите текст поста"
                  value={postContent}
                  onChange={setPostContent}
                />
              </div>
              <Switch isSelected={postPublished} isDisabled={postModerationStatus !== 'approved'} onChange={setPostPublished}>
                Публиковать сразу
              </Switch>
              <Switch isSelected={postPinned} isDisabled={postModerationStatus !== 'approved'} onChange={setPostPinned}>
                Закрепить в слайдере
              </Switch>
              <div className="flex flex-wrap gap-2">
                <Button onPress={() => void handleSavePost()} isDisabled={isSavingPost}>
                  {isSavingPost ? <Spinner color="current" size="sm" /> : postId ? 'Сохранить пост' : 'Создать пост'}
                </Button>
                {postId ? <Button variant="ghost" onPress={resetPostForm}>Сбросить</Button> : null}
              </div>
            </Card.Content>
          </Card>

          <AdminTableCard
            title="Список постов"
            description="Публикации сайта, очередь модерации и быстрый переход к редактированию."
          >
            <Table variant="secondary">
              <Table.ScrollContainer>
                <Table.Content aria-label="Список постов" className="min-w-[1120px]">
                  <Table.Header>
                    <Table.Column isRowHeader>Пост</Table.Column>
                    <Table.Column>Slug</Table.Column>
                    <Table.Column>Автор</Table.Column>
                    <Table.Column>Отправитель</Table.Column>
                    <Table.Column>Модерация</Table.Column>
                    <Table.Column>Закреп</Table.Column>
                    <Table.Column>Опубликован</Table.Column>
                    <Table.Column>Обновлен</Table.Column>
                    <Table.Column>Действия</Table.Column>
                  </Table.Header>
                  <Table.Body renderEmptyState={renderTableEmptyState('Постов пока нет.')}>
                    {(dashboard?.posts ?? []).map((post) => (
                      <Table.Row key={post.id} id={post.id}>
                        <Table.Cell>
                          <div className="grid gap-1">
                            <Text type="body-sm">{post.title}</Text>
                            <Text color="muted" type="body-sm">{post.summary}</Text>
                          </div>
                        </Table.Cell>
                        <Table.Cell>/{post.slug}</Table.Cell>
                        <Table.Cell>{post.authorName ?? 'Команда XK HARDCORE'}</Table.Cell>
                        <Table.Cell>{post.submittedByNickname ?? '—'}</Table.Cell>
                        <Table.Cell>
                          <Chip color={getPostModerationStatusMeta(post.moderationStatus).color} variant="soft">
                            {getPostModerationStatusMeta(post.moderationStatus).label}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>
                          {post.isPinned ? (
                            <Chip color="warning" variant="soft">
                              {typeof post.pinnedOrder === 'number'
                                ? `Да, #${post.pinnedOrder}`
                                : 'Да'}
                            </Chip>
                          ) : (
                            <Chip color="default" variant="soft">
                              Нет
                            </Chip>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Chip color={post.isPublished ? 'success' : 'default'} variant="soft">
                            {post.isPublished ? 'Опубликован' : 'Не опубликован'}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>{formatDate(post.publishedAt)}</Table.Cell>
                        <Table.Cell>{formatDate(post.updatedAt)}</Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-wrap gap-2">
                            {post.moderationStatus !== 'approved' ? (
                              <Button
                                className={getButtonToneClass('success')}
                                size="sm"
                                onPress={() =>
                                  requestConfirmation({
                                    title: 'Одобрить пост?',
                                    description: `Пост "${post.title}" будет опубликован в ленте.`,
                                    confirmLabel: 'Одобрить',
                                    confirmColor: 'success',
                                    onConfirm: () => handleModeratePost(post, 'approved'),
                                  })
                                }
                              >
                                Одобрить
                              </Button>
                            ) : null}
                            {post.moderationStatus !== 'rejected' ? (
                              <Button
                                className={getButtonToneClass('danger')}
                                size="sm"
                                onPress={() =>
                                  requestConfirmation({
                                    title: 'Отклонить пост?',
                                    description: `Пост "${post.title}" будет снят с публикации и помечен как отклоненный.`,
                                    confirmLabel: 'Отклонить',
                                    confirmColor: 'danger',
                                    onConfirm: () => handleModeratePost(post, 'rejected'),
                                  })
                                }
                              >
                                Отклонить
                              </Button>
                            ) : null}
                            <Button
                              size="sm"
                              variant="ghost"
                              onPress={() =>
                                requestConfirmation({
                                  title: 'Открыть пост для редактирования?',
                                  description: `Форма будет заполнена данными поста "${post.title}".`,
                                  confirmLabel: 'Открыть',
                                  onConfirm: () => editPost(post),
                                })
                              }
                            >
                              Редактировать
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </AdminTableCard>
        </div>
      ) : null}

      {selectedTab === 'navigation' ? (
        <AdminTableCard
          title="Навигация сайта"
          description="Редактирование названий, иконок, аудитории и статуса пунктов меню кабинета."
        >
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="Настройки навигации" className="min-w-[1120px]">
                <Table.Header>
                  <Table.Column isRowHeader>Раздел</Table.Column>
                  <Table.Column>Секция</Table.Column>
                  <Table.Column>Аудитория</Table.Column>
                  <Table.Column>Статус</Table.Column>
                  <Table.Column>Действия</Table.Column>
                </Table.Header>
                <Table.Body renderEmptyState={renderTableEmptyState('Разделов навигации пока нет.')}>
                  {navigationItems.map((item) => (
                    <Table.Row key={item.key} id={item.key}>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <span className="text-muted">{getNavigationIcon(item.icon)}</span>
                          <div className="grid gap-1">
                            <Text type="body-sm">{item.label}</Text>
                            <Text color="muted" type="body-sm">{item.key}</Text>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{item.section === 'primary' ? 'Основное меню' : 'Дополнительно'}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-2">
                          {item.audiences.map((role: SiteNavigationRole) => (
                            <Chip key={`${item.key}-${role}`} variant="soft">
                              {navigationRoleOptions.find((option) => option.value === role)?.label ?? role}
                            </Chip>
                          ))}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Chip
                          color={item.deleted ? 'danger' : item.visible ? 'success' : 'default'}
                          variant="soft"
                        >
                          {item.deleted ? 'Удален' : item.visible ? 'Виден' : 'Скрыт'}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            isDisabled={isSavingSettings}
                            size="sm"
                            variant="ghost"
                            onPress={() => openNavigationEditor(item)}
                          >
                            Редактировать
                          </Button>
                          <Button
                            isDisabled={isSavingSettings}
                            size="sm"
                            variant="ghost"
                            onPress={() =>
                              requestConfirmation({
                                title: item.visible ? 'Скрыть раздел?' : 'Показать раздел?',
                                description: item.visible
                                  ? `Раздел ${item.label} исчезнет из меню для выбранных групп.`
                                  : `Раздел ${item.label} снова появится в меню.`,
                                confirmLabel: item.visible ? 'Скрыть' : 'Показать',
                                confirmColor: item.visible ? 'warning' : 'success',
                                onConfirm: () =>
                                  handleSaveNavigation(
                                    navigationItems.map((candidate) =>
                                      candidate.key === item.key
                                        ? { ...candidate, visible: !candidate.visible, deleted: false }
                                        : candidate,
                                    ),
                                    item.visible ? 'Раздел скрыт' : 'Раздел показан',
                                    item.label,
                                  ),
                              })
                            }
                          >
                            {item.visible ? 'Скрыть' : 'Показать'}
                          </Button>
                          <Button
                            className={getButtonToneClass(item.deleted ? 'success' : 'danger')}
                            isDisabled={isSavingSettings}
                            size="sm"
                            variant={item.deleted ? 'secondary' : 'ghost'}
                            onPress={() =>
                              requestConfirmation({
                                title: item.deleted ? 'Вернуть раздел?' : 'Удалить раздел?',
                                description: item.deleted
                                  ? `Раздел ${item.label} снова появится в настройках и сможет отображаться в меню.`
                                  : `Раздел ${item.label} будет удален из навигации.`,
                                confirmLabel: item.deleted ? 'Вернуть' : 'Удалить',
                                confirmColor: item.deleted ? 'success' : 'danger',
                                onConfirm: () =>
                                  handleSaveNavigation(
                                    navigationItems.map((candidate) =>
                                      candidate.key === item.key
                                        ? { ...candidate, deleted: !candidate.deleted, visible: candidate.deleted ? true : candidate.visible }
                                        : candidate,
                                    ),
                                    item.deleted ? 'Раздел восстановлен' : 'Раздел удален',
                                    item.label,
                                  ),
                              })
                            }
                          >
                            {item.deleted ? 'Вернуть' : 'Удалить'}
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </AdminTableCard>
      ) : null}

      {selectedTab === 'users' ? (
        <AdminTableCard
          title="Пользователи"
          description="Пользователи из AUTH + LuckPerms, статус привязки Discord и блокировки."
        >
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="Пользователи" className="min-w-[900px]">
                <Table.Header>
                  <Table.Column isRowHeader>Игрок</Table.Column>
                  <Table.Column>Discord</Table.Column>
                  <Table.Column>Роли</Table.Column>
                  <Table.Column>Последний вход</Table.Column>
                  <Table.Column>Регистрация</Table.Column>
                  <Table.Column>Статус</Table.Column>
                  <Table.Column>Действия</Table.Column>
                </Table.Header>
                <Table.Body renderEmptyState={renderTableEmptyState('Игроков пока нет.')}>
                  {(dashboard?.players ?? []).map((player) => (
                    <Table.Row key={player.lowercaseNickname} id={player.lowercaseNickname}>
                      <Table.Cell>{player.nickname}</Table.Cell>
                      <Table.Cell>
                        <div className="grid gap-1">
                          <Chip color={player.discordLinked ? 'success' : 'default'} variant="soft">
                            {player.discordLinked ? 'Привязан' : 'Не привязан'}
                          </Chip>
                          <Text color="muted" type="body-sm">
                            {player.discordLinked && player.discordId ? player.discordId : '—'}
                          </Text>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-2">
                          {player.roles.map((role) => (
                            <Chip key={`${player.lowercaseNickname}-${role}`} variant="soft">
                              {playerRoleOptions.find((option) => option.value === role)?.label ??
                                role}
                            </Chip>
                          ))}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{formatDate(player.lastLoginAt)}</Table.Cell>
                      <Table.Cell>{formatDate(player.registeredAt)}</Table.Cell>
                      <Table.Cell>
                        <Chip color={player.blocked ? 'danger' : 'success'} variant="soft">
                          {player.blocked ? 'Заблокирован' : 'Активен'}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onPress={() =>
                              setPlayerRolesEditor({
                                player,
                                roles: [...player.roles],
                              })
                            }
                          >
                            Роли
                          </Button>
                          <Button
                            className={getButtonToneClass(player.blocked ? 'success' : 'danger')}
                            size="sm"
                            onPress={() =>
                              requestConfirmation({
                                title: player.blocked ? 'Разблокировать игрока?' : 'Заблокировать игрока?',
                                description: player.blocked
                                  ? `${player.nickname} снова получит доступ к кабинету и действиям.`
                                  : `${player.nickname} будет ограничен в доступе к кабинету.`,
                                confirmLabel: player.blocked ? 'Разблокировать' : 'Заблокировать',
                                confirmColor: player.blocked ? 'success' : 'danger',
                                onConfirm: () => handleTogglePlayerBlocked(player),
                              })
                            }
                          >
                            {player.blocked ? 'Разблокировать' : 'Заблокировать'}
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </AdminTableCard>
      ) : null}

      {selectedTab === 'payments' ? (
        <AdminTableCard
          title="Покупки"
          description="Полный журнал платежей, провайдеров и состояний оплаты."
        >
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="Покупки" className="min-w-[1140px]">
                <Table.Header>
                  <Table.Column isRowHeader>Игрок</Table.Column>
                  <Table.Column>Товар</Table.Column>
                  <Table.Column>Сумма</Table.Column>
                  <Table.Column>Статус</Table.Column>
                  <Table.Column>Провайдер</Table.Column>
                  <Table.Column>Payment ID</Table.Column>
                  <Table.Column>Создан</Table.Column>
                  <Table.Column>Обновлен</Table.Column>
                </Table.Header>
                <Table.Body renderEmptyState={renderTableEmptyState('Покупок пока нет.')}>
                  {(dashboard?.payments ?? []).map((payment) => (
                    <Table.Row key={payment.id} id={payment.id}>
                      <Table.Cell>{payment.nickname}</Table.Cell>
                      <Table.Cell>{payment.productName}</Table.Cell>
                      <Table.Cell>{payment.amountRub} руб.</Table.Cell>
                      <Table.Cell>
                        <Chip color={getPaymentStatusMeta(payment.status).color} variant="soft">
                          {getPaymentStatusMeta(payment.status).label}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>{payment.provider}</Table.Cell>
                      <Table.Cell>{payment.providerPaymentId ?? payment.id}</Table.Cell>
                      <Table.Cell>{formatDate(payment.createdAt)}</Table.Cell>
                      <Table.Cell>{formatDate(payment.updatedAt)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </AdminTableCard>
      ) : null}

      {selectedTab === 'whitelist' ? (
        <AdminTableCard
          title="Whitelist"
          description="Белый список, источник попадания и ручное удаление записей."
          action={
            <Button onPress={() => setIsWhitelistEditorOpen(true)}>
              Добавить игрока
            </Button>
          }
        >
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="Whitelist" className="min-w-[900px]">
                <Table.Header>
                  <Table.Column isRowHeader>Игрок</Table.Column>
                  <Table.Column>Источник</Table.Column>
                  <Table.Column>Покупка</Table.Column>
                  <Table.Column>Статус</Table.Column>
                  <Table.Column>Добавлен</Table.Column>
                  <Table.Column>Обновлен</Table.Column>
                  <Table.Column>Действия</Table.Column>
                </Table.Header>
                <Table.Body renderEmptyState={renderTableEmptyState('Whitelist пуст.')}>
                  {(dashboard?.whitelist ?? []).map((entry) => (
                    <Table.Row key={entry.nickname} id={entry.nickname}>
                      <Table.Cell>{entry.nickname}</Table.Cell>
                      <Table.Cell>{entry.source ?? 'Источник не указан'}</Table.Cell>
                      <Table.Cell>{entry.purchaseId ?? '—'}</Table.Cell>
                      <Table.Cell>
                        <Chip color={entry.active ? 'success' : 'default'} variant="soft">
                          {entry.active ? 'В whitelist' : 'Неактивен'}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>{formatDate(entry.createdAt)}</Table.Cell>
                      <Table.Cell>{formatDate(entry.updatedAt)}</Table.Cell>
                      <Table.Cell>
                        <Button
                          className={getButtonToneClass('danger')}
                          size="sm"
                          onPress={() =>
                            requestConfirmation({
                              title: 'Удалить из whitelist?',
                              description: `${entry.nickname} будет удален из белого списка.`,
                              confirmLabel: 'Удалить',
                              confirmColor: 'danger',
                              onConfirm: () => handleDeleteWhitelistEntry(entry),
                            })
                          }
                        >
                          Удалить
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </AdminTableCard>
      ) : null}

      {selectedTab === 'promos' ? (
        <div className="grid gap-6">
          <Card>
            <Card.Header>
              <Card.Title>Создать промокод</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <LabeledInput label="Код" value={promoCode} onChange={(event) => setPromoCode(event.target.value.toUpperCase())} placeholder="WELCOME10" />
              <LabeledInput label="Тип скидки" value={discountType} onChange={(event) => setDiscountType(event.target.value as 'percent' | 'fixed')} placeholder="percent или fixed" />
              <LabeledInput label="Значение скидки" value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} />
              <LabeledInput label="Лимит использований" value={maxUses} onChange={(event) => setMaxUses(event.target.value)} />
              <LabeledInput label="Лимит на ник" value={maxUsesPerNickname} onChange={(event) => setMaxUsesPerNickname(event.target.value)} />
              <LabeledInput label="Активен с" type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
              <LabeledInput label="Активен до" type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
              <Button onPress={() => void handleCreatePromo()} isDisabled={isSavingPromo}>
                {isSavingPromo ? <Spinner color="current" size="sm" /> : 'Создать промокод'}
              </Button>
            </Card.Content>
          </Card>

          <AdminTableCard
            title="Промокоды"
            description="Скидки, лимиты использования и состояние публикации."
          >
            <Table variant="secondary">
              <Table.ScrollContainer>
                <Table.Content aria-label="Промокоды" className="min-w-[1040px]">
                  <Table.Header>
                    <Table.Column isRowHeader>Код</Table.Column>
                    <Table.Column>Скидка</Table.Column>
                    <Table.Column>Лимит</Table.Column>
                    <Table.Column>На ник</Table.Column>
                    <Table.Column>Использовано</Table.Column>
                    <Table.Column>Статус</Table.Column>
                    <Table.Column>Период</Table.Column>
                    <Table.Column>Действия</Table.Column>
                  </Table.Header>
                  <Table.Body renderEmptyState={renderTableEmptyState('Промокодов пока нет.')}>
                    {promoCodes.map((row) => (
                      <Table.Row key={row.id} id={row.id}>
                        <Table.Cell>{row.code}</Table.Cell>
                        <Table.Cell>{formatPromoDiscount(row)}</Table.Cell>
                        <Table.Cell>{row.maxUses ?? '—'}</Table.Cell>
                        <Table.Cell>{row.maxUsesPerNickname ?? '—'}</Table.Cell>
                        <Table.Cell>{row.usedCount}</Table.Cell>
                        <Table.Cell>
                          <Chip color={getPromoStatusMeta(row.isActive).color} variant="soft">
                            {getPromoStatusMeta(row.isActive).label}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="grid gap-1">
                            <Text color="muted" type="body-sm">c {formatDate(row.startsAt)}</Text>
                            <Text color="muted" type="body-sm">до {formatDate(row.endsAt)}</Text>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onPress={() =>
                              requestConfirmation({
                                title: row.isActive ? 'Отключить промокод?' : 'Включить промокод?',
                                description: `Промокод ${row.code} будет ${row.isActive ? 'отключен' : 'включен'}.`,
                                confirmLabel: row.isActive ? 'Отключить' : 'Включить',
                                confirmColor: row.isActive ? 'danger' : 'success',
                                onConfirm: () => handleTogglePromoActive(row),
                              })
                            }
                          >
                            {row.isActive ? 'Отключить' : 'Включить'}
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </AdminTableCard>
        </div>
      ) : null}

      <Modal.Backdrop
        isOpen={isWhitelistEditorOpen}
        onOpenChange={(isOpen) => {
          setIsWhitelistEditorOpen(isOpen)

          if (!isOpen) {
            setWhitelistNickname('')
          }
        }}
      >
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-[460px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Добавить игрока в whitelist</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="grid gap-4">
              <Text color="muted" type="body-sm">
                Укажите игровой ник. Запись будет добавлена вручную и сразу
                активирована.
              </Text>
              <LabeledInput
                label="Никнейм"
                placeholder="Steve_2026"
                value={whitelistNickname}
                onChange={(event) => setWhitelistNickname(event.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={() => setIsWhitelistEditorOpen(false)}>
                Отмена
              </Button>
              <Button
                isDisabled={isSavingWhitelist}
                onPress={() => void handleCreateWhitelistEntry()}
              >
                {isSavingWhitelist ? <Spinner color="current" size="sm" /> : 'Добавить'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <Modal.Backdrop
        isOpen={Boolean(playerRolesEditor)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPlayerRolesEditor(null)
          }
        }}
      >
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-[480px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                Роли пользователя {playerRolesEditor?.player.nickname ?? ''}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="grid gap-4">
              <Text color="muted" type="body-sm">
                Роль игрока сохраняется всегда. Дополнительно можно назначить
                права модератора или администратора.
              </Text>
              <CheckboxGroup
                value={playerRolesEditor?.roles ?? ['player']}
                onChange={(value) =>
                  setPlayerRolesEditor((prev) =>
                    prev
                      ? {
                          ...prev,
                          roles: value,
                        }
                      : prev,
                  )
                }
              >
                <div className="grid gap-2">
                  {playerRoleOptions.map((option) => (
                    <Checkbox
                      key={option.value}
                      isDisabled={option.value === 'player'}
                      value={option.value}
                    >
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>{option.label}</Checkbox.Content>
                    </Checkbox>
                  ))}
                </div>
              </CheckboxGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={() => setPlayerRolesEditor(null)}>
                Отмена
              </Button>
              <Button
                isDisabled={isSavingPlayerRoles}
                onPress={() => void handleSavePlayerRoles()}
              >
                {isSavingPlayerRoles ? <Spinner color="current" size="sm" /> : 'Сохранить'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <Modal.Backdrop
        isOpen={Boolean(navigationEditor)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setNavigationEditor(null)
          }
        }}
      >
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-2xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Редактирование пункта навигации</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="grid gap-5">
              <LabeledInput
                label="Название раздела"
                value={navigationEditor?.label ?? ''}
                onChange={(event) =>
                  setNavigationEditor((prev) =>
                    prev
                      ? {
                          ...prev,
                          label: event.target.value,
                        }
                      : prev,
                  )
                }
              />

              <div className="grid gap-3">
                <Text color="muted" type="body-sm">Иконка</Text>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {navigationIconOptions.map((option) => {
                    const selected = navigationEditor?.icon === option.key

                    return (
                      <Button
                        key={option.key}
                        className="justify-start"
                        variant={selected ? 'secondary' : 'ghost'}
                        onPress={() =>
                          setNavigationEditor((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  icon: option.key,
                                }
                              : prev,
                          )
                        }
                      >
                        <span className="mr-2 inline-flex text-muted">{option.icon}</span>
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-3">
                <Text color="muted" type="body-sm">Кому показывать</Text>
                <CheckboxGroup
                  value={navigationEditor?.audiences ?? []}
                  onChange={(value) =>
                    setNavigationEditor((prev) =>
                      prev
                        ? {
                            ...prev,
                            audiences: value as SiteNavigationRole[],
                          }
                        : prev,
                    )
                  }
                >
                  <div className="grid gap-2 sm:grid-cols-3">
                    {navigationRoleOptions.map((option) => (
                      <Checkbox key={option.value} value={option.value}>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>{option.label}</Checkbox.Content>
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">
                Отмена
              </Button>
              <Button isDisabled={isSavingSettings} onPress={() => void handleSaveNavigationEditor()}>
                {isSavingSettings ? <Spinner color="current" size="sm" /> : 'Сохранить'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <AlertDialog.Backdrop
        isOpen={Boolean(confirmState)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setConfirmState(null)
          }
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[440px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon
                status={confirmState?.confirmColor === 'danger' ? 'danger' : 'accent'}
              />
              <AlertDialog.Heading>
                {confirmState?.title ?? 'Подтверждение действия'}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>{confirmState?.description ?? ''}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Отмена
              </Button>
              <Button
                className={getButtonToneClass(confirmState?.confirmColor ?? 'default')}
                slot="close"
                onPress={async () => {
                  const nextConfirmState = confirmState

                  if (!nextConfirmState) {
                    return
                  }

                  await nextConfirmState.onConfirm()
                }}
              >
                {confirmState?.confirmLabel ?? 'Подтвердить'}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
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
        onAdminViewNavigate={(view) => {
          void navigate({ to: getAdminViewPath(view) })
        }}
        onBankViewNavigate={(view) => {
          void navigate({ to: `/cabinet/bank/${view}` })
        }}
        eyebrow="Администрирование"
        title="Админка"
        description="Заявки, посты, пользователи, навигация и платежные данные сайта."
        actions={
          <>
            <HeroLinkButton to="/cabinet/news" variant="secondary">Открыть ленту</HeroLinkButton>
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
