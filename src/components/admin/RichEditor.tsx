'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Bold, Italic, List, ListOrdered, Quote, Code, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2, Heading3, Undo, Redo } from 'lucide-react';
import { useCallback } from 'react';

// Setup lowlight
const lowlight = createLowlight(common);

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuButton = ({ onClick, isActive = false, children, title, disabled }: any) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-1.5 rounded-md transition-all duration-200 ${
      isActive
        ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30 shadow-sm'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disable default codeBlock to use lowlight
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-slate-300 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/30">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 backdrop-blur-sm">

        <div className="flex items-center gap-1 mr-2">
           <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo size={16} />
          </MenuButton>
        </div>

        <div className="w-px h-5 bg-slate-800 mx-1 self-center" />

        <div className="flex items-center gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic size={16} />
            </MenuButton>
        </div>

        <div className="w-px h-5 bg-slate-800 mx-1 self-center" />

        <div className="flex items-center gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <Heading3 size={16} />
            </MenuButton>
        </div>

        <div className="w-px h-5 bg-slate-800 mx-1 self-center" />

        <div className="flex items-center gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Ordered List"
            >
              <ListOrdered size={16} />
            </MenuButton>
        </div>

        <div className="w-px h-5 bg-slate-800 mx-1 self-center" />

        <div className="flex items-center gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Blockquote"
            >
              <Quote size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              title="Code Block"
            >
              <Code size={16} />
            </MenuButton>
        </div>

        <div className="w-px h-5 bg-slate-800 mx-1 self-center" />

        <div className="flex items-center gap-1">
            <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
              <LinkIcon size={16} />
            </MenuButton>
            <MenuButton onClick={addImage} title="Image">
              <ImageIcon size={16} />
            </MenuButton>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
