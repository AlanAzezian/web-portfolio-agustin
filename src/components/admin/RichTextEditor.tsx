"use client";

import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  TextStyle,
  Color,
  FontFamily,
  FontSize,
} from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  Eraser,
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const FONT_SIZE_STEPS = [12, 14, 16, 18, 20, 24, 28];
const DEFAULT_FONT_SIZE = 16;

const FONT_FAMILIES = [
  { label: "Roboto", value: "" },
  { label: "Sans-serif", value: "Arial, Helvetica, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "'Courier New', Courier, monospace" },
];

const TEXT_COLORS = [
  { label: "Celeste Marca (#099AD7)", value: "#099AD7" },
  { label: "Negro Carbón (#1C1C1A)", value: "#1C1C1A" },
  { label: "Gris Técnico (#686661)", value: "#686661" },
  { label: "Gris Piedra (#9A9892)", value: "#9A9892" },
  { label: "Azul Profundo (#065F87)", value: "#065F87" },
  { label: "Rojo Técnico (#A84A4A)", value: "#A84A4A" },
];

const HIGHLIGHT_COLORS = [
  { label: "Celeste Suave", value: "#E0F2FE" },
  { label: "Celeste Intenso", value: "#BAE6FD" },
  { label: "Amarillo Pastel", value: "#FEF3C7" },
  { label: "Verde Pastel", value: "#DCFCE7" },
  { label: "Gris Editorial", value: "#F5F5F4" },
];

function ensureHtmlFormat(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "<p></p>";
  if (trimmed.startsWith("<")) return trimmed;
  return trimmed
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function parseFontSizePx(raw: unknown): number {
  if (typeof raw !== "string" || !raw.trim()) return DEFAULT_FONT_SIZE;
  const num = parseInt(raw.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(num) && num >= 10 && num <= 72
    ? num
    : DEFAULT_FONT_SIZE;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [, setSelectionTick] = useState(0);
  const [openMenu, setOpenMenu] = useState<"color" | "highlight" | null>(null);
  const [activeTextColor, setActiveTextColor] = useState<string>("#099AD7");
  const [activeHighlightColor, setActiveHighlightColor] =
    useState<string>("#E0F2FE");

  const toolbarRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        underline: false,
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: ensureHtmlFormat(value),
    editorProps: {
      attributes: {
        class:
          "tiptap-editor-content min-h-[200px] w-full p-4 bg-[#FFFFFF] text-[#1C1C1A] text-sm font-roboto leading-relaxed focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
      setSelectionTick((t) => t + 1);
    },
    onSelectionUpdate: () => {
      setSelectionTick((t) => t + 1);
    },
    onTransaction: () => {
      setSelectionTick((t) => t + 1);
    },
  });

  // Cerrar menús desplegables de color/resaltador al hacer clic fuera
  useEffect(() => {
    if (!openMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

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
      <div className="w-full min-h-[244px] border border-neutral-200 bg-[#FFFFFF] rounded-none p-3.5 text-xs text-[#686661]">
        Inicializando editor...
      </div>
    );
  }

  // Estado actual del cursor / selección
  const currentHeadingValue = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "p";

  const textStyleAttrs = editor.getAttributes("textStyle") as {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
  };

  const currentFontFamily = textStyleAttrs.fontFamily || "";
  const currentFontSize = parseFontSizePx(textStyleAttrs.fontSize);
  const currentColorAttr = textStyleAttrs.color || activeTextColor;

  const isBoldActive = editor.isActive("bold");
  const isItalicActive = editor.isActive("italic");
  const isUnderlineActive = editor.isActive("underline");
  const isHighlightActive = editor.isActive("highlight");

  const handleHeadingChange = (val: string) => {
    if (val === "p") {
      editor.chain().focus().setParagraph().run();
    } else if (val === "h1") {
      editor.chain().focus().setHeading({ level: 1 }).run();
    } else if (val === "h2") {
      editor.chain().focus().setHeading({ level: 2 }).run();
    } else if (val === "h3") {
      editor.chain().focus().setHeading({ level: 3 }).run();
    }
  };

  const handleFontFamilyChange = (fontVal: string) => {
    if (!fontVal) {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(fontVal).run();
    }
  };

  const handleSetFontSize = (nextSize: number) => {
    const clamped = Math.max(10, Math.min(48, nextSize));
    if (clamped === DEFAULT_FONT_SIZE) {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(`${clamped}px`).run();
    }
  };

  const handleStepFontSize = (direction: -1 | 1) => {
    const idx = FONT_SIZE_STEPS.findIndex((s) => s >= currentFontSize);
    if (direction === -1) {
      const prevIdx =
        idx <= 0 ? 0 : FONT_SIZE_STEPS[idx] === currentFontSize ? idx - 1 : idx - 1;
      handleSetFontSize(FONT_SIZE_STEPS[Math.max(0, prevIdx)]);
    } else {
      const nextIdx =
        idx === -1
          ? FONT_SIZE_STEPS.length - 1
          : FONT_SIZE_STEPS[idx] === currentFontSize
            ? Math.min(FONT_SIZE_STEPS.length - 1, idx + 1)
            : idx;
      handleSetFontSize(FONT_SIZE_STEPS[nextIdx]);
    }
  };

  const handleApplyTextColor = (colorHex: string) => {
    setActiveTextColor(colorHex);
    editor.chain().focus().setColor(colorHex).run();
    setOpenMenu(null);
  };

  const handleResetTextColor = () => {
    editor.chain().focus().unsetColor().run();
    setOpenMenu(null);
  };

  const handleApplyHighlight = (colorHex: string) => {
    setActiveHighlightColor(colorHex);
    editor.chain().focus().setHighlight({ color: colorHex }).run();
    setOpenMenu(null);
  };

  const handleResetHighlight = () => {
    editor.chain().focus().unsetHighlight().run();
    setOpenMenu(null);
  };

  const handleClearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
    setOpenMenu(null);
  };

  return (
    <div className="w-full border border-neutral-200 bg-[#FFFFFF] rounded-none focus-within:border-[#099AD7] transition-colors">
      {/* Barra de herramientas estilo Outlook / Word */}
      <div
        ref={toolbarRef}
        role="toolbar"
        aria-label="Herramientas de formato de texto"
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-200 bg-[#FFFFFF] select-none"
      >
        {/* 1. Nivel de Encabezado / Párrafo */}
        <div className="flex items-center pr-1.5 mr-1 border-r border-neutral-200">
          <select
            aria-label="Nivel de encabezado o párrafo"
            value={currentHeadingValue}
            onChange={(e) => handleHeadingChange(e.target.value)}
            className="h-7 px-2 bg-[#FFFFFF] hover:bg-neutral-100 text-[#1C1C1A] text-xs font-roboto border border-transparent hover:border-neutral-200 focus:border-[#099AD7] rounded-none focus:outline-none cursor-pointer"
          >
            <option value="p">Párrafo</option>
            <option value="h1">Encabezado 1</option>
            <option value="h2">Encabezado 2</option>
            <option value="h3">Encabezado 3</option>
          </select>
        </div>

        {/* 2. Selector de Fuente */}
        <div className="flex items-center pr-1.5 mr-1 border-r border-neutral-200">
          <select
            aria-label="Tipografía"
            value={currentFontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="h-7 px-2 bg-[#FFFFFF] hover:bg-neutral-100 text-[#1C1C1A] text-xs font-roboto border border-transparent hover:border-neutral-200 focus:border-[#099AD7] rounded-none focus:outline-none cursor-pointer"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font.label} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Control de Tamaño de Fuente (− [16] +) */}
        <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-neutral-200">
          <input
            type="number"
            min={10}
            max={48}
            value={currentFontSize}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (Number.isFinite(val)) handleSetFontSize(val);
            }}
            aria-label="Tamaño de fuente en píxeles"
            title="Tamaño de fuente (px)"
            className="w-10 h-7 px-1 text-center bg-[#FFFFFF] hover:bg-neutral-100 text-[#1C1C1A] text-xs font-roboto tabular-nums border border-neutral-200 focus:border-[#099AD7] rounded-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => handleStepFontSize(-1)}
            title="Disminuir tamaño de fuente (−)"
            aria-label="Disminuir tamaño de fuente"
            className="w-6 h-7 inline-flex items-center justify-center bg-[#FFFFFF] hover:bg-neutral-100 text-[#1C1C1A] border border-transparent hover:border-neutral-200 rounded-none transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => handleStepFontSize(1)}
            title="Aumentar tamaño de fuente (+)"
            aria-label="Aumentar tamaño de fuente"
            className="w-6 h-7 inline-flex items-center justify-center bg-[#FFFFFF] hover:bg-neutral-100 text-[#1C1C1A] border border-transparent hover:border-neutral-200 rounded-none transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* 4. Estilos Básicos: B / I / U */}
        <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-neutral-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Negrita (Ctrl+B)"
            aria-label="Negrita"
            aria-pressed={isBoldActive}
            className={`w-7 h-7 inline-flex items-center justify-center rounded-none transition-colors ${
              isBoldActive
                ? "bg-sky-50 text-[#099AD7] font-semibold"
                : "bg-[#FFFFFF] text-[#1C1C1A] hover:bg-neutral-100"
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Cursiva (Ctrl+I)"
            aria-label="Cursiva"
            aria-pressed={isItalicActive}
            className={`w-7 h-7 inline-flex items-center justify-center rounded-none transition-colors ${
              isItalicActive
                ? "bg-sky-50 text-[#099AD7] font-semibold"
                : "bg-[#FFFFFF] text-[#1C1C1A] hover:bg-neutral-100"
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Subrayado (Ctrl+U)"
            aria-label="Subrayado"
            aria-pressed={isUnderlineActive}
            className={`w-7 h-7 inline-flex items-center justify-center rounded-none transition-colors ${
              isUnderlineActive
                ? "bg-sky-50 text-[#099AD7] font-semibold"
                : "bg-[#FFFFFF] text-[#1C1C1A] hover:bg-neutral-100"
            }`}
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5. Color de Fuente (A con barra de color) + 6. Resaltador */}
        <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-neutral-200">
          {/* Selector de Color de Fuente */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => handleApplyTextColor(activeTextColor)}
              title={`Aplicar color de fuente (${activeTextColor})`}
              aria-label="Aplicar color de fuente"
              className={`h-7 px-1.5 inline-flex flex-col items-center justify-center rounded-none transition-colors ${
                textStyleAttrs.color
                  ? "bg-sky-50 text-[#099AD7]"
                  : "bg-[#FFFFFF] text-[#1C1C1A] hover:bg-neutral-100"
              }`}
            >
              <span className="text-xs font-semibold leading-none">A</span>
              <span
                className="w-3.5 h-1 mt-0.5"
                style={{ backgroundColor: currentColorAttr }}
              />
            </button>
            <button
              type="button"
              onClick={() =>
                setOpenMenu((prev) => (prev === "color" ? null : "color"))
              }
              title="Elegir color de fuente"
              aria-label="Elegir color de fuente"
              className="h-7 px-0.5 inline-flex items-center justify-center bg-[#FFFFFF] hover:bg-neutral-100 text-[#686661] rounded-none"
            >
              <ChevronDown className="w-3 h-3" />
            </button>

            {openMenu === "color" && (
              <div className="absolute left-0 top-full mt-1 z-30 w-44 bg-[#FFFFFF] border border-neutral-200 shadow-lg p-2 flex flex-col gap-1.5 rounded-none">
                <span className="text-[10px] uppercase tracking-wider text-[#686661] font-medium px-1">
                  Color de fuente
                </span>
                <div className="grid grid-cols-6 gap-1 px-1">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleApplyTextColor(c.value)}
                      title={c.label}
                      aria-label={c.label}
                      className="w-5 h-5 border border-neutral-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleResetTextColor}
                  className="mt-1 w-full py-1 px-2 text-left text-[11px] text-[#686661] hover:bg-neutral-100 hover:text-[#1C1C1A]"
                >
                  Automático (#1C1C1A)
                </button>
              </div>
            )}
          </div>

          {/* Resaltador / Marcador */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => {
                if (isHighlightActive) {
                  editor.chain().focus().unsetHighlight().run();
                } else {
                  handleApplyHighlight(activeHighlightColor);
                }
              }}
              title="Resaltar texto"
              aria-label="Resaltar texto"
              aria-pressed={isHighlightActive}
              className={`h-7 px-1.5 inline-flex flex-col items-center justify-center rounded-none transition-colors ${
                isHighlightActive
                  ? "bg-sky-50 text-[#099AD7]"
                  : "bg-[#FFFFFF] text-[#1C1C1A] hover:bg-neutral-100"
              }`}
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span
                className="w-3.5 h-1 mt-0.5 border border-neutral-300"
                style={{ backgroundColor: activeHighlightColor }}
              />
            </button>
            <button
              type="button"
              onClick={() =>
                setOpenMenu((prev) =>
                  prev === "highlight" ? null : "highlight"
                )
              }
              title="Elegir color de resaltado"
              aria-label="Elegir color de resaltado"
              className="h-7 px-0.5 inline-flex items-center justify-center bg-[#FFFFFF] hover:bg-neutral-100 text-[#686661] rounded-none"
            >
              <ChevronDown className="w-3 h-3" />
            </button>

            {openMenu === "highlight" && (
              <div className="absolute left-0 top-full mt-1 z-30 w-44 bg-[#FFFFFF] border border-neutral-200 shadow-lg p-2 flex flex-col gap-1.5 rounded-none">
                <span className="text-[10px] uppercase tracking-wider text-[#686661] font-medium px-1">
                  Color de resaltado
                </span>
                <div className="grid grid-cols-5 gap-1.5 px-1">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleApplyHighlight(c.value)}
                      title={c.label}
                      aria-label={c.label}
                      className="w-5 h-5 border border-neutral-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleResetHighlight}
                  className="mt-1 w-full py-1 px-2 text-left text-[11px] text-[#686661] hover:bg-neutral-100 hover:text-[#1C1C1A]"
                >
                  Sin resaltado
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 7. Limpiar Formato */}
        <button
          type="button"
          onClick={handleClearFormatting}
          title="Limpiar formato"
          aria-label="Limpiar formato"
          className="h-7 px-2 inline-flex items-center gap-1 bg-[#FFFFFF] hover:bg-neutral-100 text-[#686661] hover:text-[#1C1C1A] text-[11px] font-roboto rounded-none transition-colors"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpiar</span>
        </button>
      </div>

      {/* Área editable */}
      <EditorContent editor={editor} />
    </div>
  );
}
