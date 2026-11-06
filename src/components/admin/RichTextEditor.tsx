"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Bold, Heading3, Palette, Eraser } from "lucide-react";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const ACCENT_COLOR = "#099AD7";

function ensureHtmlFormat(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "<p></p>";
  if (trimmed.startsWith("<")) return trimmed;
  return trimmed
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3],
        },
      }),
      TextStyle,
      Color,
    ],
    content: ensureHtmlFormat(value),
    editorProps: {
      attributes: {
        class:
          "tiptap-editor-content min-h-[190px] w-full p-3.5 bg-[#FFFFFF] text-[#1C1C1A] text-sm font-roboto leading-relaxed focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  // Sincronizar si el valor externo cambia (ej. tras cargar datos iniciales de Supabase)
  useEffect(() => {
    if (!editor) return;
    const formattedIncoming = ensureHtmlFormat(value);
    const currentHtml = editor.getHTML();

    if (
      formattedIncoming !== currentHtml &&
      !editor.isFocused &&
      value.trim() !== editor.getText().trim()
    ) {
      editor.commands.setContent(formattedIncoming, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="w-full min-h-[232px] border border-neutral-200 bg-[#FFFFFF] rounded-none p-3.5 text-xs text-[#686661]">
        Inicializando editor...
      </div>
    );
  }

  const isBoldActive = editor.isActive("bold");
  const isH3Active = editor.isActive("heading", { level: 3 });
  const isCelesteActive =
    editor.isActive("textStyle", { color: ACCENT_COLOR }) ||
    editor.isActive("textStyle", { color: "rgb(9, 154, 215)" });

  const handleToggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const handleToggleH3 = () => {
    editor.chain().focus().toggleHeading({ level: 3 }).run();
  };

  const handleToggleCeleste = () => {
    if (isCelesteActive) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(ACCENT_COLOR).run();
    }
  };

  const handleClearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  return (
    <div className="w-full border border-neutral-200 bg-[#FFFFFF] rounded-none focus-within:border-[#099AD7] transition-colors">
      {/* Barra de herramientas superior compacta */}
      <div
        role="toolbar"
        aria-label="Herramientas de formato de texto"
        className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-2 border-b border-neutral-200 bg-neutral-50/70"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {/* B (Negrita / Bold) */}
          <button
            type="button"
            onClick={handleToggleBold}
            title="Negrita (Bold)"
            aria-label="Negrita"
            aria-pressed={isBoldActive}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] uppercase tracking-wider font-roboto border rounded-none transition-colors ${
              isBoldActive
                ? "bg-[#1C1C1A] text-white border-[#1C1C1A] font-semibold"
                : "bg-[#FFFFFF] text-[#1C1C1A] border-neutral-300 hover:border-[#099AD7] hover:text-[#099AD7] font-medium"
            }`}
          >
            <Bold className="w-3 h-3" />
            <span>B</span>
          </button>

          {/* H3 (Subtítulo / Agrandar texto) */}
          <button
            type="button"
            onClick={handleToggleH3}
            title="Subtítulo / Agrandar texto (H3)"
            aria-label="Subtítulo H3"
            aria-pressed={isH3Active}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] uppercase tracking-wider font-roboto border rounded-none transition-colors ${
              isH3Active
                ? "bg-[#1C1C1A] text-white border-[#1C1C1A] font-semibold"
                : "bg-[#FFFFFF] text-[#1C1C1A] border-neutral-300 hover:border-[#099AD7] hover:text-[#099AD7] font-medium"
            }`}
          >
            <Heading3 className="w-3.5 h-3.5" />
            <span>H3</span>
          </button>

          {/* Color Celeste (#099AD7) */}
          <button
            type="button"
            onClick={handleToggleCeleste}
            title="Aplicar Color Celeste Institucional (#099AD7)"
            aria-label="Color Celeste"
            aria-pressed={isCelesteActive}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] uppercase tracking-wider font-roboto border rounded-none transition-colors ${
              isCelesteActive
                ? "bg-[#099AD7] text-white border-[#099AD7] font-semibold"
                : "bg-[#FFFFFF] text-[#1C1C1A] border-neutral-300 hover:border-[#099AD7] hover:text-[#099AD7] font-medium"
            }`}
          >
            <span
              aria-hidden="true"
              className={`w-2.5 h-2.5 border ${
                isCelesteActive
                  ? "bg-white border-white"
                  : "bg-[#099AD7] border-[#099AD7]"
              }`}
            />
            <Palette className="w-3 h-3" />
            <span>Color Celeste</span>
          </button>
        </div>

        {/* Normalizar / Limpiar formato */}
        <button
          type="button"
          onClick={handleClearFormatting}
          title="Normalizar / Limpiar formato"
          aria-label="Limpiar formato"
          className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] uppercase tracking-wider font-roboto font-medium bg-[#FFFFFF] text-[#686661] border border-neutral-300 hover:border-[#1C1C1A] hover:text-[#1C1C1A] rounded-none transition-colors"
        >
          <Eraser className="w-3 h-3" />
          <span>Limpiar formato</span>
        </button>
      </div>

      {/* Área editable */}
      <EditorContent editor={editor} />
    </div>
  );
}
