"use client"
import { useState } from "react"
import { Editor, EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"

type ToolbarButton = {
    label: string
    action: () => void
    isActive: boolean
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null

    const buttons: ToolbarButton[] = [
        {
            label: "H1",
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive("heading", { level: 1 }),
        },
        {
            label: "H2",
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive("heading", { level: 2 }),
        },
        {
            label: "H3",
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive("heading", { level: 3 }),
        },
        {
            label: "Bold",
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive("bold"),
        },
        {
            label: "Italic",
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive("italic"),
        },
        {
            label: "Strike",
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive("strike"),
        },
        {
            label: "Quote",
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive("blockquote"),
        },
        {
            label: "Code",
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: editor.isActive("codeBlock"),
        },
        {
            label: "OL",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive("orderedList"),
        },
        {
            label: "UL",
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive("bulletList"),
        },
    ]

    return (
        <div className="flex flex-wrap gap-2 border-b border-white/10 bg-hover px-4 py-2 text-sm">
            {buttons.map((button) => (
                <button
                    key={button.label}
                    type="button"
                    onClick={button.action}
                    className={`rounded-md border border-white/10 px-3 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                        button.isActive
                            ? "bg-white/20 text-white"
                            : "text-gray-300 hover:bg-white/5"
                    }`}
                >
                    {button.label}
                </button>
            ))}
        </div>
    )
}

export default function WritePage() {
    const [content, setContent] = useState("")

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: {
                    HTMLAttributes: {
                        class: "bg-black/40 rounded-lg px-4 py-3 font-mono text-sm",
                    },
                },
            }),
            Placeholder.configure({
                placeholder: "Start writing your article here...",
            }),
        ],
        editorProps: {
            attributes: {
                class: "tiptap-editor",
            },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML())
        },
        immediatelyRender: false,
    })

    return (
        <section className="max-w-2xl mx-auto py-20 px-6">
            <h1 className="mb-10 text-3xl font-bold text-white">Write a new article</h1>

            <form>
                <label htmlFor="article-title" className="sr-only">Article title</label>
                <input
                    id="article-title"
                    type="text"
                    placeholder="Article title"
                    className="mb-6 w-full bg-transparent text-4xl text-white placeholder-gray-500 outline-none"
                />

                <label htmlFor="article-excerpt" className="sr-only">Article excerpt</label>
                <textarea
                    id="article-excerpt"
                    placeholder="Write a short excerpt (1-2 sentences)"
                    rows={3}
                    className="mb-8 w-full resize-none rounded-xl border border-white/10 bg-secondary-background p-4 text-gray-200 outline-none placeholder-gray-500 focus:border-indigo-500/50"
                />

                <div className="mb-10">
                    <label className="mb-2 block text-gray-400">Upload a cover image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-indigo-500"
                    />
                </div>

                <div className="rounded-2xl border border-white/10 bg-secondary-background">
                    <EditorToolbar editor={editor} />
                    <div className="px-4 pb-4 pt-3">
                        <EditorContent editor={editor} />
                    </div>
                </div>

                <input type="hidden" name="content" value={content} />
            </form>
        </section>
    )
}
