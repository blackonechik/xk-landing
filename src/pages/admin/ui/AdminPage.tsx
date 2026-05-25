import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Alert, Spinner } from '@heroui/react'
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
import {
  parseOptionalPositiveInt,
  normalizePostContentHtml,
} from '../lib/admin-format'
import { playerRoleOptions } from '../model/constants'
import type {
  ConfirmationState,
  NavigationEditorState,
  PlayerRolesEditorState,
} from '../model/types'
import { useAdminStats } from '../hooks/useAdminStats'
import { useAdminToasts } from '../hooks/useAdminToasts'
import { OverviewSection } from './sections/OverviewSection'
import { ApplicationsSection } from './sections/ApplicationsSection'
import { PostsSection } from './sections/PostsSection'
import { NavigationSection } from './sections/NavigationSection'
import { UsersSection } from './sections/UsersSection'
import { PaymentsSection } from './sections/PaymentsSection'
import { WhitelistSection } from './sections/WhitelistSection'
import { PromosSection } from './sections/PromosSection'
import { PostEditorModal } from './components/PostEditorModal'
import { WhitelistEditorModal } from './components/WhitelistEditorModal'
import { PlayerRolesEditorModal } from './components/PlayerRolesEditorModal'
import { NavigationEditorModal } from './components/NavigationEditorModal'
import { AdminConfirmationDialog } from './components/AdminConfirmationDialog'
import { fetchAccountCached, getCachedAccount } from '@/entities/account'
import type { AccountPayload } from '@/entities/account'
import { clearSiteSettingsCache } from '@/entities/site'
import type {
  SiteNavigationIconKey,
  SiteNavigationItem,
  SiteNavigationRole,
} from '@/entities/site'
import { AccountLayout } from '@/widgets/account/layout'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'
import {
  defaultSiteNavigationItems,
  getAdminViewFromPathname,
  getAdminViewPath,
} from '@/widgets/account/sidebar/model/account-sidebar-menu'
import type { AdminView } from '@/widgets/account/sidebar/model/account-sidebar-menu'

export function AdminPage() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [account, setAccount] = useState<AccountPayload | null>(() =>
    getCachedAccount(),
  )
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [promoCodes, setPromoCodes] = useState<AdminPromoCodeRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingPromo, setIsSavingPromo] = useState(false)
  const [isSavingPost, setIsSavingPost] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [error, setError] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>(
    'percent',
  )
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
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false)
  const [applicationNotes, setApplicationNotes] = useState<
    Record<string, string>
  >({})
  const [confirmState, setConfirmState] = useState<ConfirmationState>(null)
  const [navigationEditor, setNavigationEditor] =
    useState<NavigationEditorState>(null)
  const [playerRolesEditor, setPlayerRolesEditor] =
    useState<PlayerRolesEditorState>(null)
  const [isSavingPlayerRoles, setIsSavingPlayerRoles] = useState(false)
  const [isWhitelistEditorOpen, setIsWhitelistEditorOpen] = useState(false)
  const [whitelistNickname, setWhitelistNickname] = useState('')
  const [isSavingWhitelist, setIsSavingWhitelist] = useState(false)

  const isSessionAdmin = account?.player.siteRole === 'admin'
  const selectedTab: AdminView = getAdminViewFromPathname(pathname)
  const { showErrorToast, showInfoToast, showSuccessToast } = useAdminToasts()
  const stats = useAdminStats(dashboard, promoCodes)

  const navigationItems = useMemo(
    () =>
      (dashboard?.settings.navigation.items.length
        ? [...dashboard.settings.navigation.items]
        : [...defaultSiteNavigationItems]
      ).sort((left, right) => left.order - right.order),
    [dashboard?.settings.navigation.items],
  )

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

  async function loadDashboard() {
    if (!isSessionAdmin) {
      setError('Нужен вход под пользователем с ролью администратора сайта.')
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
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
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Ошибка загрузки данных.'
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
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
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

    const parsedMaxUsesPerNickname =
      parseOptionalPositiveInt(maxUsesPerNickname)
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
      showSuccessToast(
        'Промокод создан',
        `Код ${promo.code} добавлен в систему.`,
      )
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
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    try {
      const updated = await updatePromoCode(promo.id, {
        isActive: !promo.isActive,
      })

      setPromoCodes((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      )
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

  async function handleUpdateApplication(
    application: AdminApplicationRow,
    status: string,
  ) {
    if (!isSessionAdmin || !account) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
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
        `${application.nickname}: ${updated.status}.`,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить заявку',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  async function handleSavePost() {
    if (!isSessionAdmin || !account) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
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
          postModerationStatus === 'pending' ? null : account.player.nickname,
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

      setIsPostEditorOpen(false)
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
    setIsPostEditorOpen(true)
    void navigate({ to: getAdminViewPath('posts') })
  }

  function openCreatePostEditor() {
    resetPostForm()
    setIsPostEditorOpen(true)
  }

  async function handleModeratePost(
    post: AdminPostRow,
    moderationStatus: 'approved' | 'rejected',
  ) {
    if (!isSessionAdmin || !account) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
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
        moderationStatus === 'approved' ? 'Пост одобрен' : 'Пост отклонен',
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

  async function handleSaveNavigation(
    items: SiteNavigationItem[],
    successMessage: string,
    description?: string,
  ) {
    if (!isSessionAdmin) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
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

    await handleSaveNavigation(
      nextItems,
      'Навигация обновлена',
      `Раздел ${navigationEditor.label.trim()} сохранен.`,
    )
    setNavigationEditor(null)
  }

  async function handleTogglePlayerBlocked(player: AdminPlayerRow) {
    if (!isSessionAdmin) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
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
      showSuccessToast(
        'Роли пользователя обновлены',
        playerRolesEditor.player.nickname,
      )
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
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
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
                  (item) =>
                    item.nickname.toLowerCase() !==
                    entry.nickname.toLowerCase(),
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
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    try {
      await deleteAdminWhitelistEntry(entry.nickname)
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              whitelist: prev.whitelist.filter(
                (item) => item.nickname !== entry.nickname,
              ),
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

      {selectedTab === 'overview' ? (
        <OverviewSection dashboard={dashboard} stats={stats} />
      ) : null}

      {selectedTab === 'applications' ? (
        <ApplicationsSection
          applications={dashboard?.applications ?? []}
          applicationNotes={applicationNotes}
          setApplicationNotes={setApplicationNotes}
          requestConfirmation={requestConfirmation}
          handleUpdateApplication={handleUpdateApplication}
        />
      ) : null}

      {selectedTab === 'posts' ? (
        <PostsSection
          posts={dashboard?.posts ?? []}
          openCreatePostEditor={openCreatePostEditor}
          requestConfirmation={requestConfirmation}
          handleModeratePost={handleModeratePost}
          editPost={editPost}
        />
      ) : null}

      {selectedTab === 'navigation' ? (
        <NavigationSection
          navigationItems={navigationItems}
          isSavingSettings={isSavingSettings}
          openNavigationEditor={openNavigationEditor}
          requestConfirmation={requestConfirmation}
          handleSaveNavigation={handleSaveNavigation}
        />
      ) : null}

      {selectedTab === 'users' ? (
        <UsersSection
          players={dashboard?.players ?? []}
          playerRoleOptions={playerRoleOptions}
          setPlayerRolesEditor={setPlayerRolesEditor}
          requestConfirmation={requestConfirmation}
          handleTogglePlayerBlocked={handleTogglePlayerBlocked}
        />
      ) : null}

      {selectedTab === 'payments' ? (
        <PaymentsSection payments={dashboard?.payments ?? []} />
      ) : null}

      {selectedTab === 'whitelist' ? (
        <WhitelistSection
          whitelist={dashboard?.whitelist ?? []}
          onOpenCreate={() => setIsWhitelistEditorOpen(true)}
          requestConfirmation={requestConfirmation}
          handleDeleteWhitelistEntry={handleDeleteWhitelistEntry}
        />
      ) : null}

      {selectedTab === 'promos' ? (
        <PromosSection
          promoCodes={promoCodes}
          promoCode={promoCode}
          discountType={discountType}
          discountValue={discountValue}
          maxUses={maxUses}
          maxUsesPerNickname={maxUsesPerNickname}
          startsAt={startsAt}
          endsAt={endsAt}
          isSavingPromo={isSavingPromo}
          setPromoCode={setPromoCode}
          setDiscountType={setDiscountType}
          setDiscountValue={setDiscountValue}
          setMaxUses={setMaxUses}
          setMaxUsesPerNickname={setMaxUsesPerNickname}
          setStartsAt={setStartsAt}
          setEndsAt={setEndsAt}
          handleCreatePromo={handleCreatePromo}
          handleTogglePromoActive={handleTogglePromoActive}
          requestConfirmation={requestConfirmation}
        />
      ) : null}

      <PostEditorModal
        isOpen={isPostEditorOpen}
        postId={postId}
        postTitle={postTitle}
        postSlug={postSlug}
        postSummary={postSummary}
        postContent={postContent}
        postAuthorName={postAuthorName}
        postCoverTone={postCoverTone}
        postCoverImageUrl={postCoverImageUrl}
        postSubmittedByNickname={postSubmittedByNickname}
        postModerationStatus={postModerationStatus}
        postReviewNote={postReviewNote}
        postPinned={postPinned}
        postPinnedOrder={postPinnedOrder}
        postPublished={postPublished}
        isSavingPost={isSavingPost}
        onOpenChange={(isOpen) => {
          setIsPostEditorOpen(isOpen)

          if (!isOpen) {
            resetPostForm()
          }
        }}
        setPostTitle={setPostTitle}
        setPostSlug={setPostSlug}
        setPostSummary={setPostSummary}
        setPostContent={setPostContent}
        setPostAuthorName={setPostAuthorName}
        setPostCoverTone={setPostCoverTone}
        setPostCoverImageUrl={setPostCoverImageUrl}
        setPostSubmittedByNickname={setPostSubmittedByNickname}
        setPostModerationStatus={setPostModerationStatus}
        setPostReviewNote={setPostReviewNote}
        setPostPinned={setPostPinned}
        setPostPinnedOrder={setPostPinnedOrder}
        setPostPublished={setPostPublished}
        onCancel={() => {
          setIsPostEditorOpen(false)
          resetPostForm()
        }}
        onSave={() => void handleSavePost()}
      />

      <WhitelistEditorModal
        isOpen={isWhitelistEditorOpen}
        nickname={whitelistNickname}
        isSaving={isSavingWhitelist}
        onOpenChange={(isOpen) => {
          setIsWhitelistEditorOpen(isOpen)

          if (!isOpen) {
            setWhitelistNickname('')
          }
        }}
        onNicknameChange={setWhitelistNickname}
        onSubmit={() => void handleCreateWhitelistEntry()}
      />

      <PlayerRolesEditorModal
        playerRolesEditor={playerRolesEditor}
        isSavingPlayerRoles={isSavingPlayerRoles}
        playerRoleOptions={playerRoleOptions}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPlayerRolesEditor(null)
          }
        }}
        onRolesChange={(roles) =>
          setPlayerRolesEditor((prev) =>
            prev
              ? {
                  ...prev,
                  roles,
                }
              : prev,
          )
        }
        onSubmit={() => void handleSavePlayerRoles()}
      />

      <NavigationEditorModal
        navigationEditor={navigationEditor}
        isSavingSettings={isSavingSettings}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setNavigationEditor(null)
          }
        }}
        onLabelChange={(value) =>
          setNavigationEditor((prev) =>
            prev
              ? {
                  ...prev,
                  label: value,
                }
              : prev,
          )
        }
        onIconChange={(icon) =>
          setNavigationEditor((prev) =>
            prev
              ? {
                  ...prev,
                  icon: icon as SiteNavigationIconKey,
                }
              : prev,
          )
        }
        onAudiencesChange={(roles) =>
          setNavigationEditor((prev) =>
            prev
              ? {
                  ...prev,
                  audiences: roles as SiteNavigationRole[],
                }
              : prev,
          )
        }
        onSubmit={() => void handleSaveNavigationEditor()}
      />

      <AdminConfirmationDialog
        confirmState={confirmState}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setConfirmState(null)
          }
        }}
      />
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
          <HeroLinkButton to="/cabinet/news" variant="secondary">
            Открыть ленту
          </HeroLinkButton>
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
