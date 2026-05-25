import { useState } from 'react'
import {
  Button,
  Input,
  Modal,
  Spinner,
  Text,
  toast,
} from '@heroui/react'
import { CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { submitSitePost } from '@/entities/site'
import { LexicalRichTextEditor } from '@/shared/ui/rich-text-editor'

type CreatePostSubmissionModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

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

export function CreatePostSubmissionModal({
  isOpen,
  onOpenChange,
}: CreatePostSubmissionModalProps) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
    setTitle('')
    setSummary('')
    setCoverImageUrl('')
    setContent('')
  }

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

  async function handleSubmit() {
    const normalizedContent = normalizePostContentHtml(content)

    if (!title.trim() || !summary.trim() || !normalizedContent.trim()) {
      showInfoToast(
        'Заполните заголовок, краткое описание и текст поста',
      )
      return
    }

    setIsSubmitting(true)

    try {
      await submitSitePost({
        title: title.trim(),
        summary: summary.trim(),
        content: normalizedContent.trim(),
        coverImageUrl: coverImageUrl.trim() || null,
        coverTone: 'slate',
      })

      resetForm()
      onOpenChange(false)
      showSuccessToast(
        'Пост отправлен на модерацию',
        'После проверки администратором он появится в общей ленте.',
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось отправить пост',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="auto">
        <Modal.Dialog className="font-sans sm:max-w-3xl **:font-sans">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Написать пост</Modal.Heading>
            <Text className="mt-2" color="muted" type="body-sm">
              Заполните публикацию и отправьте ее на модерацию. После
              одобрения администратором пост появится в ленте.
            </Text>
          </Modal.Header>
          <Modal.Body className="grid gap-4 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Заголовок"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <Input
                label="Картинка обложки"
                placeholder="https://... или /assets/..."
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
              />
            </div>
            <Input
              label="Краткое описание"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
            <LexicalRichTextEditor
              label="Текст поста"
              placeholder="Напишите текст поста"
              value={content}
              onChange={setContent}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onPress={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button isDisabled={isSubmitting} onPress={() => void handleSubmit()}>
              {isSubmitting ? <Spinner color="current" size="sm" /> : null}
              Отправить на модерацию
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
