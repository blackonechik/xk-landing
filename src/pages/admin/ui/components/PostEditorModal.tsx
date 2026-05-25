import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
  Spinner,
  Switch,
  Text,
} from '@heroui/react'
import { LexicalRichTextEditor } from '@/shared/ui/rich-text-editor'
import { LabeledInput } from './LabeledInput'

type PostEditorModalProps = {
  isOpen: boolean
  postId: string
  postTitle: string
  postSlug: string
  postSummary: string
  postContent: string
  postAuthorName: string
  postCoverTone: string
  postCoverImageUrl: string
  postSubmittedByNickname: string
  postModerationStatus: string
  postReviewNote: string
  postPinned: boolean
  postPinnedOrder: string
  postPublished: boolean
  isSavingPost: boolean
  onOpenChange: (isOpen: boolean) => void
  setPostTitle: (value: string) => void
  setPostSlug: (value: string) => void
  setPostSummary: (value: string) => void
  setPostContent: (value: string) => void
  setPostAuthorName: (value: string) => void
  setPostCoverTone: (value: string) => void
  setPostCoverImageUrl: (value: string) => void
  setPostSubmittedByNickname: (value: string) => void
  setPostModerationStatus: (value: string) => void
  setPostReviewNote: (value: string) => void
  setPostPinned: (value: boolean) => void
  setPostPinnedOrder: (value: string) => void
  setPostPublished: (value: boolean) => void
  onCancel: () => void
  onSave: () => void
}

export function PostEditorModal({
  isOpen,
  postId,
  postTitle,
  postSlug,
  postSummary,
  postContent,
  postAuthorName,
  postCoverTone,
  postCoverImageUrl,
  postSubmittedByNickname,
  postModerationStatus,
  postReviewNote,
  postPinned,
  postPinnedOrder,
  postPublished,
  isSavingPost,
  onOpenChange,
  setPostTitle,
  setPostSlug,
  setPostSummary,
  setPostContent,
  setPostAuthorName,
  setPostCoverTone,
  setPostCoverImageUrl,
  setPostSubmittedByNickname,
  setPostModerationStatus,
  setPostReviewNote,
  setPostPinned,
  setPostPinnedOrder,
  setPostPublished,
  onCancel,
  onSave,
}: PostEditorModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="auto">
        <Modal.Dialog className="font-sans sm:max-w-4xl **:font-sans">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>
              {postId ? 'Модерация и редактирование поста' : 'Новый пост'}
            </Modal.Heading>
            <Text className="mt-2" color="muted" type="body-sm">
              {postId
                ? 'Обновите содержимое, статус модерации и параметры публикации.'
                : 'Создайте пост для ленты и при необходимости сразу опубликуйте его.'}
            </Text>
          </Modal.Header>
          <Modal.Body className="grid gap-4 p-6 xl:grid-cols-2">
            <LabeledInput
              label="Заголовок"
              value={postTitle}
              onChange={(event) => setPostTitle(event.target.value)}
            />
            <LabeledInput
              label="Slug"
              value={postSlug}
              onChange={(event) => setPostSlug(event.target.value)}
              placeholder="оставьте пустым для автогенерации"
            />
            <LabeledInput
              label="Краткое описание"
              value={postSummary}
              onChange={(event) => setPostSummary(event.target.value)}
            />
            <LabeledInput
              label="Автор"
              value={postAuthorName}
              onChange={(event) => setPostAuthorName(event.target.value)}
            />
            <LabeledInput
              label="Отправил на модерацию"
              value={postSubmittedByNickname}
              onChange={(event) =>
                setPostSubmittedByNickname(event.target.value)
              }
              placeholder="ник игрока"
            />
            <LabeledInput
              label="Тон обложки"
              value={postCoverTone}
              onChange={(event) => setPostCoverTone(event.target.value)}
              placeholder="slate, amber, emerald..."
            />
            <LabeledInput
              label="Картинка обложки"
              value={postCoverImageUrl}
              onChange={(event) => setPostCoverImageUrl(event.target.value)}
              placeholder="https://... или /assets/..."
            />
            <LabeledInput
              label="Порядок закрепа"
              value={postPinnedOrder}
              onChange={(event) => setPostPinnedOrder(event.target.value)}
              placeholder="1, 2, 3..."
            />
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
            <LabeledInput
              label="Комментарий модератора"
              value={postReviewNote}
              onChange={(event) => setPostReviewNote(event.target.value)}
              placeholder="опционально"
            />
            <div className="grid gap-3 xl:col-span-2">
              <LexicalRichTextEditor
                label="Текст поста"
                placeholder="Напишите текст поста"
                value={postContent}
                onChange={setPostContent}
              />
            </div>
            <Switch
              isSelected={postPublished}
              isDisabled={postModerationStatus !== 'approved'}
              onChange={setPostPublished}
            >
              Публиковать сразу
            </Switch>
            <Switch
              isSelected={postPinned}
              isDisabled={postModerationStatus !== 'approved'}
              onChange={setPostPinned}
            >
              Закрепить в слайдере
            </Switch>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onPress={onCancel}>
              Отмена
            </Button>
            <Button isDisabled={isSavingPost} onPress={onSave}>
              {isSavingPost ? <Spinner color="current" size="sm" /> : null}
              {postId ? 'Сохранить пост' : 'Создать пост'}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
