"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function WritePage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] w-full bg-transparent text-gray-200 outline-none prose prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const toolbarButtonClass =
    "px-3 py-1.5 rounded-md text-sm border transition-colors cursor-pointer";

  const getToolbarButtonClass = (active: boolean, disabled = false) =>
    `${toolbarButtonClass} ${
      active
        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
        : "bg-transparent border-white/10 text-gray-300 hover:border-white/20 hover:text-white"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!title || !coverImage || !excerpt || !content || content === "<p></p>") {
        toast("All fields are required!", {
          style: { color: "white", background: "#1e3a8a" },
        });
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("coverImage", coverImage);

      await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setExcerpt("");
      setCoverImage(null);
      setContent("");
      editor?.commands.clearContent();

      toast("Article published successfully", {
        style: { color: "white", background: "#1e3a8a" },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data?.error || "Failed to publish article", {
          style: { color: "white", background: "#1e3a8a" },
        });
      } else {
        toast("Failed to publish article", {
          style: { color: "white", background: "#1e3a8a" },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold text-white mb-10">Write a new article</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Article title"
          className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-500 outline-none mb-6"
        />

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Write a short excerpt (1–2 sentences)"
          rows={3}
          className="w-full bg-secondary-background text-gray-200 placeholder-gray-500 rounded-xl p-4 mb-8 outline-none resize-none border border-white/10 focus:border-indigo-500/50"
        />

        <div className="mb-10">
          <label className="block text-gray-400 mb-2">Cover Image</label>
          <input
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white hover:file:bg-indigo-500"
          />
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 mb-10 bg-secondary-background p-4">
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3 mb-4">
            <button
              type="button"
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={getToolbarButtonClass(!!editor?.isActive("paragraph"))}
            >
              P
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={getToolbarButtonClass(!!editor?.isActive("heading", { level: 1 }))}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={getToolbarButtonClass(!!editor?.isActive("heading", { level: 2 }))}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={getToolbarButtonClass(!!editor?.isActive("heading", { level: 3 }))}
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={getToolbarButtonClass(!!editor?.isActive("bold"))}
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={getToolbarButtonClass(!!editor?.isActive("italic"))}
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={getToolbarButtonClass(!!editor?.isActive("strike"))}
            >
              Strike
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={getToolbarButtonClass(!!editor?.isActive("code"))}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={getToolbarButtonClass(!!editor?.isActive("bulletList"))}
            >
              Bullet List
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={getToolbarButtonClass(!!editor?.isActive("orderedList"))}
            >
              Numbered List
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={getToolbarButtonClass(!!editor?.isActive("blockquote"))}
            >
              Quote
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={getToolbarButtonClass(!!editor?.isActive("codeBlock"))}
            >
              Code Block
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className={getToolbarButtonClass(false)}
            >
              HR
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setHardBreak().run()}
              className={getToolbarButtonClass(false)}
            >
              Line Break
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().unsetAllMarks().run()}
              className={getToolbarButtonClass(false)}
            >
              Clear Marks
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().clearNodes().run()}
              className={getToolbarButtonClass(false)}
            >
              Clear Blocks
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().chain().focus().undo().run()}
              className={getToolbarButtonClass(
                false,
                !editor?.can().chain().focus().undo().run()
              )}
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().chain().focus().redo().run()}
              className={getToolbarButtonClass(
                false,
                !editor?.can().chain().focus().redo().run()
              )}
            >
              Redo
            </button>
          </div>
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-full bg-primary cursor-pointer text-white font-semibold transition-colors hover:bg-indigo-500 disabled:opacity-60"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </section>
  );
}
