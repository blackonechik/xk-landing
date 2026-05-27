import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AdminConfirmationDialog } from '../components/AdminConfirmationDialog'
import { PostEditorModal } from '../components/PostEditorModal'
import { PostsSection } from '../sections/PostsSection'
import { createAdminPost, updateAdminPost } from '../../model/api'
import { normalizePostContentHtml } from '../../lib/admin-format'
import type { ConfirmationState } from '../../model/types'
import { useAdminPageContext } from '../../model/admin-page-context'
import { getAdminViewPath } from '@/widgets/account/sidebar/model/account-sidebar-menu'
import type { AdminPostRow } from '../../model/api'

export function AdminPostsRoute() {
  const navigate = useNavigate()
  const {
    account,
    dashboard,
    isSessionAdmin,
    setDashboard,
    showErrorToast,
    showInfoToast,
    showSuccessToast,
  } = useAdminPageContext()
  const [confirmState, setConfirmState] = useState<ConfirmationState>(null)
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
  const [isSavingPost, setIsSavingPost] = useState(false)

  function requestConfirmation(nextState: ConfirmationState) {
    setConfirmState(nextState)
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

        return {
          ...prev,
          posts: postId
            ? prev.posts.map((item) => (item.id === saved.id ? saved : item))
            : [saved, ...prev.posts],
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

  return (
    <>
      <PostsSection
        posts={dashboard?.posts ?? []}
        openCreatePostEditor={openCreatePostEditor}
        requestConfirmation={requestConfirmation}
        handleModeratePost={handleModeratePost}
        editPost={editPost}
      />

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

      <AdminConfirmationDialog
        confirmState={confirmState}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setConfirmState(null)
          }
        }}
      />
    </>
  )
}
