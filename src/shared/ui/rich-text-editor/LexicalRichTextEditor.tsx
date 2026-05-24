import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  ButtonGroup,
  Separator,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from '@heroui/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Redo,
  Underline,
  Undo,
} from 'lucide-react'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type EditorState,
  type LexicalEditor,
} from 'lexical'

type LexicalRichTextEditorProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function normalizeInitialHtml(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return '<p></p>'
  }

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed
  }

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('')
}

function normalizeExportedHtml(value: string) {
  const trimmed = value.trim()

  if (!trimmed || trimmed === '<p><br></p>') {
    return ''
  }

  return trimmed
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  const updateToolbarState = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection()

      if (!$isRangeSelection(selection)) {
        setActiveFormats(new Set())
        return
      }

      const nextFormats = new Set<string>()

      if (selection.hasFormat('bold')) {
        nextFormats.add('bold')
      }

      if (selection.hasFormat('italic')) {
        nextFormats.add('italic')
      }

      if (selection.hasFormat('underline')) {
        nextFormats.add('underline')
      }

      setActiveFormats(nextFormats)
    })
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updateToolbarState()
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbarState()
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, updateToolbarState])

  return (
    <Toolbar aria-label="Editor toolbar">
      <ButtonGroup variant="tertiary">
        <Button
          isDisabled={!canUndo}
          isIconOnly
          aria-label="Undo"
          onPress={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          <Undo size={16} />
        </Button>
        <Button
          isDisabled={!canRedo}
          isIconOnly
          aria-label="Redo"
          onPress={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <ButtonGroup.Separator />
          <Redo size={16} />
        </Button>
      </ButtonGroup>
      <Separator />
      <ToggleButtonGroup
        aria-label="Text style"
        selectedKeys={activeFormats}
        selectionMode="multiple"
      >
        <ToggleButton
          isIconOnly
          aria-label="Bold"
          id="bold"
          onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        >
          <Bold size={16} />
        </ToggleButton>
        <ToggleButton
          isIconOnly
          aria-label="Italic"
          id="italic"
          onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        >
          <ToggleButtonGroup.Separator />
          <Italic size={16} />
        </ToggleButton>
        <ToggleButton
          isIconOnly
          aria-label="Underline"
          id="underline"
          onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        >
          <ToggleButtonGroup.Separator />
          <Underline size={16} />
        </ToggleButton>
      </ToggleButtonGroup>
      <Separator />
      <ButtonGroup variant="tertiary">
        <Button
          isIconOnly
          aria-label="Align left"
          onPress={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          isIconOnly
          aria-label="Align center"
          onPress={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        >
          <ButtonGroup.Separator />
          <AlignCenter size={16} />
        </Button>
        <Button
          isIconOnly
          aria-label="Align right"
          onPress={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        >
          <ButtonGroup.Separator />
          <AlignRight size={16} />
        </Button>
      </ButtonGroup>
    </Toolbar>
  )
}

function HtmlSyncPlugin({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [editor] = useLexicalComposerContext()
  const lastAppliedValueRef = useRef(normalizeInitialHtml(value))

  useEffect(() => {
    const normalized = normalizeInitialHtml(value)

    if (lastAppliedValueRef.current === normalized) {
      return
    }

    editor.update(() => {
      const parser = new DOMParser()
      const dom = parser.parseFromString(normalized, 'text/html')
      const nodes = $generateNodesFromDOM(editor, dom)
      const root = $getRoot()

      root.clear()

      if (nodes.length > 0) {
        root.append(...nodes)
      } else {
        root.append($createParagraphNode())
      }
    })

    lastAppliedValueRef.current = normalized
  }, [editor, value])

  const handleChange = useCallback(
    (editorState: EditorState, lexicalEditor: LexicalEditor) => {
      editorState.read(() => {
        const nextHtml = normalizeExportedHtml($generateHtmlFromNodes(lexicalEditor, null))
        lastAppliedValueRef.current = normalizeInitialHtml(nextHtml)
        onChange(nextHtml)
      })
    },
    [onChange],
  )

  return <OnChangePlugin onChange={handleChange} />
}

export function LexicalRichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Напишите текст поста',
}: LexicalRichTextEditorProps) {
  const initialConfig = useMemo(
    () => ({
      namespace: 'xk-admin-post-editor',
      onError(error: Error) {
        throw error
      },
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
      theme: {
        paragraph: 'my-3 first:mt-0 last:mb-0',
        ltr: 'text-left',
        rtl: 'text-right',
        text: {
          bold: 'font-semibold',
          italic: 'italic',
          underline: 'underline underline-offset-2',
        },
      },
      editorState(editor: LexicalEditor) {
        editor.update(() => {
          const parser = new DOMParser()
          const dom = parser.parseFromString(normalizeInitialHtml(value), 'text/html')
          const nodes = $generateNodesFromDOM(editor, dom)
          const root = $getRoot()

          root.clear()

          if (nodes.length > 0) {
            root.append(...nodes)
            return
          }

          root.append($createParagraphNode())
        })
      },
    }),
    [value],
  )

  return (
    <div className="grid gap-3">
      {label ? (
        <span className="text-sm text-muted">{label}</span>
      ) : null}
      <LexicalComposer initialConfig={initialConfig}>
        <div className="grid gap-3">
          <ToolbarPlugin />
          <div className="relative rounded-[calc(var(--radius-lg)-2px)] border border-default-200 bg-content1 px-4 py-3 transition-colors focus-within:border-primary">
            <RichTextPlugin
              ErrorBoundary={LexicalErrorBoundary}
              contentEditable={
                <ContentEditable className="min-h-64 text-sm outline-none" />
              }
              placeholder={
                <div className="pointer-events-none absolute left-4 top-3 text-sm text-muted">
                  {placeholder}
                </div>
              }
            />
            <HistoryPlugin />
            <HtmlSyncPlugin value={value} onChange={onChange} />
            <AutoFocusPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}
