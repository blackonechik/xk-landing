import { Button, Chip, Table, Text } from '@heroui/react'
import { CheckCircle2, CircleX, Pencil, Plus } from 'lucide-react'
import type { AdminPostRow } from '../../model/api'
import { formatDate } from '../../lib/admin-format'
import { getButtonToneClass } from '../../lib/getButtonToneClass'
import { getPostModerationStatusMeta } from '../../model/constants'
import type { ConfirmationState } from '../../model/types'
import { AdminTableCard } from '../components/AdminTableCard'

type PostsSectionProps = {
  posts: AdminPostRow[]
  openCreatePostEditor: () => void
  requestConfirmation: (nextState: ConfirmationState) => void
  handleModeratePost: (
    post: AdminPostRow,
    moderationStatus: 'approved' | 'rejected',
  ) => Promise<void>
  editPost: (post: AdminPostRow) => void
}

export function PostsSection({
  posts,
  openCreatePostEditor,
  requestConfirmation,
  handleModeratePost,
  editPost,
}: PostsSectionProps) {
  return (
    <div className="grid gap-6">
      <AdminTableCard
        title="Список постов"
        description="Публикации сайта, очередь модерации и быстрый переход к редактированию."
        action={
          <Button variant="secondary" onPress={openCreatePostEditor}>
            <Plus size={18} />
            Новый пост
          </Button>
        }
      >
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Список постов"
              className="min-w-[1120px]"
            >
              <Table.Header>
                <Table.Column isRowHeader>Пост</Table.Column>
                <Table.Column>Slug</Table.Column>
                <Table.Column>Автор</Table.Column>
                <Table.Column>Отправитель</Table.Column>
                <Table.Column>Модерация</Table.Column>
                <Table.Column>Закреп</Table.Column>
                <Table.Column>Опубликован</Table.Column>
                <Table.Column>Дата публикации</Table.Column>
                <Table.Column>Обновлен</Table.Column>
                <Table.Column>Действия</Table.Column>
              </Table.Header>
              <Table.Body
                renderEmptyState={() => (
                  <div className="px-4 py-6 text-sm text-muted">
                    Постов пока нет.
                  </div>
                )}
              >
                {posts.map((post) => (
                  <Table.Row key={post.id} id={post.id}>
                    <Table.Cell>
                      <div className="grid gap-1">
                        <Text type="body-sm">{post.title}</Text>
                        <Text color="muted" type="body-sm">
                          {post.summary}
                        </Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell>/{post.slug}</Table.Cell>
                    <Table.Cell>
                      {post.authorName ?? 'Команда XK HARDCORE'}
                    </Table.Cell>
                    <Table.Cell>{post.submittedByNickname ?? '—'}</Table.Cell>
                    <Table.Cell>
                      <Chip
                        color={
                          getPostModerationStatusMeta(post.moderationStatus)
                            .color
                        }
                        variant="soft"
                      >
                        {
                          getPostModerationStatusMeta(post.moderationStatus)
                            .label
                        }
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
                      <Chip
                        color={post.isPublished ? 'success' : 'default'}
                        variant="soft"
                      >
                        {post.isPublished ? 'Опубликован' : 'Не опубликован'}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>{formatDate(post.publishedAt)}</Table.Cell>
                    <Table.Cell>{formatDate(post.updatedAt)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        {post.moderationStatus !== 'approved' ? (
                          <Button
                            aria-label={`Одобрить пост ${post.title}`}
                            className={getButtonToneClass('success')}
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            onPress={() =>
                              requestConfirmation({
                                title: 'Одобрить пост?',
                                description: `Пост "${post.title}" будет опубликован в ленте.`,
                                confirmLabel: 'Одобрить',
                                confirmColor: 'success',
                                onConfirm: () =>
                                  handleModeratePost(post, 'approved'),
                              })
                            }
                          >
                            <CheckCircle2 size={18} />
                          </Button>
                        ) : null}
                        {post.moderationStatus !== 'rejected' ? (
                          <Button
                            aria-label={`Отклонить пост ${post.title}`}
                            className={getButtonToneClass('danger')}
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            onPress={() =>
                              requestConfirmation({
                                title: 'Отклонить пост?',
                                description: `Пост "${post.title}" будет снят с публикации и помечен как отклоненный.`,
                                confirmLabel: 'Отклонить',
                                confirmColor: 'danger',
                                onConfirm: () =>
                                  handleModeratePost(post, 'rejected'),
                              })
                            }
                          >
                            <CircleX size={18} />
                          </Button>
                        ) : null}
                        <Button
                          aria-label={`Редактировать пост ${post.title}`}
                          isIconOnly
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
                          <Pencil size={18} />
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
  )
}
