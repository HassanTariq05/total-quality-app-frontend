import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  RotateCw,
} from 'lucide-react'
import './titap-styles.css'

const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
}: any) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    className={`rounded-lg p-2 transition-all ${
      isActive
        ? 'bg-primary text-white'
        : 'hover:bg-muted bg-background text-foreground'
    } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
  >
    {children}
  </button>
)

export default function TiptapEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // This is the KEY fix for bullet/numbered lists in shadcn:
        listItem: { HTMLAttributes: { class: 'list-item' } },
        bulletList: { HTMLAttributes: { class: 'list-disc' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal' } },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
    ],
    content: value,
    editorProps: {
      attributes: {
        // ← This class is now styled in tiptap.css
        class:
          'tiptap prose prose-sm max-w-none focus:outline-none min-h-[120px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className='space-y-3'>
      {/* Toolbar */}
      <div className='bg-muted/50 rounded-xl border p-3'>
        <div className='flex flex-wrap gap-1'>
          {/* Headings */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive('heading', { level: 3 })}
          >
            <Heading3 className='h-4 w-4' />
          </ToolbarButton>

          <div className='bg-border mx-2 w-px' />

          {/* Basic marks */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          >
            <UnderlineIcon className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
          >
            <Strikethrough className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
          >
            <Highlighter className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          >
            <Code className='h-4 w-4' />
          </ToolbarButton>

          <div className='bg-border mx-2 w-px' />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered className='h-4 w-4' />
          </ToolbarButton>

          <div className='bg-border mx-2 w-px' />

          {/* Block */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <Quote className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className='h-4 w-4' />
          </ToolbarButton>

          <div className='bg-border mx-2 w-px' />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
          >
            <AlignLeft className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
          >
            <AlignCenter className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
          >
            <AlignRight className='h-4 w-4' />
          </ToolbarButton>

          <div className='bg-border mx-2 w-px' />

          {/* History */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
          >
            <RotateCw className='h-4 w-4' />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div className='bg-background rounded-xl border'>
        <EditorContent editor={editor} className='p-4' />
      </div>
    </div>
  )
}
