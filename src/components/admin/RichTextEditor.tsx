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
  Minus,
  Plus,
  ChevronDown,
  Pipette,
  Type,
  X,
} from "lucide-react";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const FONT_SIZE_STEPS = [12, 14, 16, 18, 20, 24, 28, 32];
const DEFAULT_FONT_SIZE = 16;
const ADD_FONT_OPTION_VALUE = "__ADD_CUSTOM_FONT__";
const CUSTOM_FONTS_STORAGE_KEY = "af_custom_google_fonts";

interface FontOption {
  label: string;
  value: string;
  googleFamily?: string;
}

const DEFAULT_FONT_FAMILIES: FontOption[] = [
  { label: "Roboto (Predeterminada)", value: "" },
  {
    label: "Roboto Mono",
    value: "'Roboto Mono', monospace",
    googleFamily: "Roboto Mono",
  },
  {
    label: "EB Garamond",
    value: "'EB Garamond', Georgia, serif",
    googleFamily: "EB Garamond",
  },
];

export function loadGoogleFontInDocument(fontName: string) {
  if (typeof document === "undefined") return;
  const clean = fontName
    .replace(/['"]/g, "")
    .split(",")[0]
    .trim();
  if (
    !clean ||
    clean.toLowerCase() === "roboto" ||
    clean.toLowerCase() === "sans-serif" ||
    clean.toLowerCase() === "serif" ||
    clean.toLowerCase() === "monospace" ||
    clean.toLowerCase() === "georgia"
  ) {
    return;
  }

  const linkId = `gf-${clean.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  if (document.getElementById(linkId)) return;

  const familyQuery = encodeURIComponent(clean).replace(/%20/g, "+");
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${familyQuery}:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}

function extractFontFamiliesFromHtml(html: string): string[] {
  const matches: string[] = [];
  const regex = /font-family:\s*([^;"]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const raw = match[1].replace(/['"]/g, "").split(",")[0].trim();
    if (raw) matches.push(raw);
  }
  return Array.from(new Set(matches));
}

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

function isValidHex(val: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val.trim());
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [, setSelectionTick] = useState(0);
  const [openMenu, setOpenMenu] = useState<"color" | "highlight" | null>(null);
  const [activeTextColor, setActiveTextColor] = useState<string>("#099AD7");
  const [customTextHexInput, setCustomTextHexInput] =
    useState<string>("#099AD7");
  const [activeHighlightColor, setActiveHighlightColor] =
    useState<string>("#E0F2FE");
  const [customHighlightHexInput, setCustomHighlightHexInput] =
    useState<string>("#E0F2FE");

  // Tipografías dinámicas (3 predeterminadas + agregadas por el usuario)
  const [fontOptions, setFontOptions] = useState<FontOption[]>(
    DEFAULT_FONT_FAMILIES
  );
  const [isAddFontOpen, setIsAddFontOpen] = useState(false);
  const [newFontNameInput, setNewFontNameInput] = useState("");

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

  // Cargar tipografías personalizadas guardadas o presentes en el HTML
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedNames = new Set<string>();

    try {
      const raw = window.localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((n) => {
            if (typeof n === "string" && n.trim()) savedNames.add(n.trim());
          });
        }
      }
    } catch {
      // Ignorar errores de localStorage
    }

    extractFontFamiliesFromHtml(value).forEach((n) => savedNames.add(n));

    const extraOptions: FontOption[] = [];
    savedNames.forEach((name) => {
      loadGoogleFontInDocument(name);
      const alreadyDefault = DEFAULT_FONT_FAMILIES.some(
        (d) =>
          d.label.toLowerCase() === name.toLowerCase() ||
          d.googleFamily?.toLowerCase() === name.toLowerCase()
      );
      if (!alreadyDefault) {
        extraOptions.push({
          label: name,
          value: `'${name}', sans-serif`,
          googleFamily: name,
        });
      }
    });

    if (extraOptions.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFontOptions([...DEFAULT_FONT_FAMILIES, ...extraOptions]);
    }
  }, [value]);

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

  const handleFontSelectChange = (selectedVal: string) => {
    if (selectedVal === ADD_FONT_OPTION_VALUE) {
      setIsAddFontOpen(true);
      return;
    }
    if (!selectedVal) {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(selectedVal).run();
    }
  };

  const handleAddCustomFont = () => {
    const cleanName = newFontNameInput.replace(/['"]/g, "").trim();
    if (!cleanName) return;

    loadGoogleFontInDocument(cleanName);
    const cssFontValue = `'${cleanName}', sans-serif`;

    setFontOptions((prev) => {
      const exists = prev.some(
        (f) =>
          f.label.toLowerCase() === cleanName.toLowerCase() ||
          f.value.toLowerCase() === cssFontValue.toLowerCase()
      );
      const next = exists
        ? prev
        : [
            ...prev,
            {
              label: cleanName,
              value: cssFontValue,
              googleFamily: cleanName,
            },
          ];

      if (typeof window !== "undefined") {
        try {
          const customNames = next
            .filter(
              (f) =>
                !DEFAULT_FONT_FAMILIES.some((def) => def.label === f.label) &&
                f.googleFamily
            )
            .map((f) => f.googleFamily!);
          window.localStorage.setItem(
            CUSTOM_FONTS_STORAGE_KEY,
            JSON.stringify(customNames)
          );
        } catch {
          // Ignorar errores de almacenamiento
        }
      }
      return next;
    });

    editor.chain().focus().setFontFamily(cssFontValue).run();
    setNewFontNameInput("");
    setIsAddFontOpen(false);
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
        idx <= 0
          ? 0
          : FONT_SIZE_STEPS[idx] === currentFontSize
            ? idx - 1
            : idx - 1;
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

  const handleApplyTextColor = (colorHex: string, closeDropdown = true) => {
    setActiveTextColor(colorHex);
    setCustomTextHexInput(colorHex);
    editor.chain().focus().setColor(colorHex).run();
    if (closeDropdown) setOpenMenu(null);
  };

  const handleResetTextColor = () => {
    editor.chain().focus().unsetColor().run();
    setOpenMenu(null);
  };

  const handleApplyHighlight = (colorHex: string, closeDropdown = true) => {
    setActiveHighlightColor(colorHex);
    setCustomHighlightHexInput(colorHex);
    editor.chain().focus().setHighlight({ color: colorHex }).run();
    if (closeDropdown) setOpenMenu(null);
  };

  const handleResetHighlight = () => {
    editor.chain().focus().unsetHighlight().run();
    setOpenMenu(null);
  };

  return (
    <div className="w-full border border-neutral-200 bg-[#FFFFFF] rounded-none focus-within:border-[#099AD7] transition-colors">
      {/* Barra de herramientas minimalista y limpia */}
      <div
        ref={toolbarRef}
        role="toolbar"
        aria-label="Herramientas de formato de texto"
        className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 border-b border-neutral-200 bg-[#FFFFFF] select-none"
      >
        {/* 1. Selector Dinámico de Tipografías (Roboto, Roboto Mono, EB Garamond + Agregar Tipografía) */}
        <div className="flex items-center gap-1 pr-2 mr-1 border-r border-neutral-200">
          <Type className="w-3.5 h-3.5 text-[#686661] shrink-0" />
          <select
            aria-label="Tipografía"
            value={
              fontOptions.some((f) => f.value === currentFontFamily)
                ? currentFontFamily
                : ""
            }
            onChange={(e) => handleFontSelectChange(e.target.value)}
            className="h-7 px-2 max-w-[190px] bg-[#FFFFFF] hover:bg-neutral-100 text-[#1C1C1A] text-xs font-roboto border border-neutral-200 focus:border-[#099AD7] rounded-none focus:outline-none cursor-pointer truncate"
          >
            {fontOptions.map((font) => (
              <option key={font.label} value={font.value}>
                {font.label}
              </option>
            ))}
            <option
              value={ADD_FONT_OPTION_VALUE}
              className="font-semibold text-[#099AD7]"
            >
              + AGREGAR TIPOGRAFÍA...
            </option>
          </select>
        </div>

        {/* 2. Control de Tamaño de Fuente (− [16] +) */}
        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-neutral-200">
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

        {/* 3. Estilos Básicos: B / I / U */}
        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-neutral-200">
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

        {/* 4. Color de Fuente Libre + 5. Resaltador Libre */}
        <div className="flex items-center gap-1">
          {/* Selector Libre de Color de Fuente */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => handleApplyTextColor(activeTextColor)}
              title={`Aplicar color de fuente (${activeTextColor})`}
              aria-label="Aplicar color de fuente"
              className={`h-7 px-2 inline-flex flex-col items-center justify-center rounded-none transition-colors ${
                textStyleAttrs.color
                  ? "bg-sky-50 text-[#099AD7]"
                  : "bg-[#FFFFFF] text-[#1C1C1A] hover:bg-neutral-100"
              }`}
            >
              <span className="text-xs font-semibold leading-none">A</span>
              <span
                className="w-4 h-1 mt-0.5 border border-neutral-300"
                style={{ backgroundColor: currentColorAttr }}
              />
            </button>
            <button
              type="button"
              onClick={() =>
                setOpenMenu((prev) => (prev === "color" ? null : "color"))
              }
              title="Seleccionar color personalizado de fuente"
              aria-label="Seleccionar color de fuente"
              className="h-7 px-1 inline-flex items-center justify-center bg-[#FFFFFF] hover:bg-neutral-100 text-[#686661] rounded-none"
            >
              <ChevronDown className="w-3 h-3" />
            </button>

            {openMenu === "color" && (
              <div className="absolute left-0 top-full mt-1.5 z-30 w-64 bg-[#FFFFFF] border border-neutral-200 shadow-xl p-3.5 flex flex-col gap-3 rounded-none">
                <span className="text-[10px] uppercase tracking-wider text-[#1C1C1A] font-medium flex items-center gap-1.5">
                  <Pipette className="w-3 h-3 text-[#099AD7]" />
                  <span>Selector libre de color (HEX)</span>
                </span>

                {/* Accesos rápidos esenciales: Celeste Marca y Negro Carbón */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyTextColor("#099AD7", true)}
                    className="flex-1 h-7 px-2 border border-neutral-200 hover:border-[#099AD7] bg-[#FFFFFF] flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#1C1C1A]"
                  >
                    <span className="w-3 h-3 bg-[#099AD7] shrink-0" />
                    <span>Celeste</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTextColor("#1C1C1A", true)}
                    className="flex-1 h-7 px-2 border border-neutral-200 hover:border-[#1C1C1A] bg-[#FFFFFF] flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#1C1C1A]"
                  >
                    <span className="w-3 h-3 bg-[#1C1C1A] shrink-0" />
                    <span>Negro</span>
                  </button>
                </div>

                {/* Input color nativo + código HEX + botón OK contenido sin desborde */}
                <div className="flex items-center gap-2 w-full">
                  <label
                    title="Abrir rueda cromática"
                    className="relative w-8 h-8 border border-neutral-300 shrink-0 cursor-pointer overflow-hidden"
                    style={{ backgroundColor: activeTextColor }}
                  >
                    <input
                      type="color"
                      value={
                        isValidHex(activeTextColor)
                          ? activeTextColor
                          : "#099AD7"
                      }
                      onChange={(e) =>
                        handleApplyTextColor(e.target.value, false)
                      }
                      aria-label="Rueda de color de fuente"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </label>
                  <input
                    type="text"
                    value={customTextHexInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomTextHexInput(val);
                      if (isValidHex(val)) {
                        handleApplyTextColor(val, false);
                      }
                    }}
                    placeholder="#099AD7"
                    aria-label="Código HEX de color de fuente"
                    className="min-w-0 flex-1 h-8 px-2.5 bg-[#FFFFFF] border border-neutral-300 text-xs font-mono text-[#1C1C1A] rounded-none focus:outline-none focus:border-[#099AD7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isValidHex(customTextHexInput)) {
                        handleApplyTextColor(customTextHexInput, true);
                      } else {
                        setOpenMenu(null);
                      }
                    }}
                    className="h-8 px-3 bg-[#099AD7] text-white text-[11px] uppercase tracking-wider font-medium rounded-none hover:bg-[#0886BC] shrink-0"
                  >
                    OK
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResetTextColor}
                  className="w-full py-1 px-2 text-left text-[11px] text-[#686661] hover:bg-neutral-100 hover:text-[#1C1C1A] border-t border-neutral-100 pt-2"
                >
                  Restablecer color original
                </button>
              </div>
            )}
          </div>

          {/* Resaltador / Marcador Libre */}
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
              className={`h-7 px-2 inline-flex flex-col items-center justify-center rounded-none transition-colors ${
                isHighlightActive
                  ? "bg-sky-50 text-[#099AD7]"
                  : "bg-[#FFFFFF] text-[#1C1C1A] hover:bg-neutral-100"
              }`}
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span
                className="w-4 h-1 mt-0.5 border border-neutral-300"
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
              title="Elegir color de fondo / resaltado"
              aria-label="Elegir color de resaltado"
              className="h-7 px-1 inline-flex items-center justify-center bg-[#FFFFFF] hover:bg-neutral-100 text-[#686661] rounded-none"
            >
              <ChevronDown className="w-3 h-3" />
            </button>

            {openMenu === "highlight" && (
              <div className="absolute right-0 sm:left-0 top-full mt-1.5 z-30 w-64 bg-[#FFFFFF] border border-neutral-200 shadow-xl p-3.5 flex flex-col gap-3 rounded-none">
                <span className="text-[10px] uppercase tracking-wider text-[#1C1C1A] font-medium flex items-center gap-1.5">
                  <Pipette className="w-3 h-3 text-[#099AD7]" />
                  <span>Color de resaltado libre (HEX)</span>
                </span>

                <div className="flex items-center gap-2 w-full">
                  <label
                    title="Abrir rueda cromática de resaltado"
                    className="relative w-8 h-8 border border-neutral-300 shrink-0 cursor-pointer overflow-hidden"
                    style={{ backgroundColor: activeHighlightColor }}
                  >
                    <input
                      type="color"
                      value={
                        isValidHex(activeHighlightColor)
                          ? activeHighlightColor
                          : "#E0F2FE"
                      }
                      onChange={(e) =>
                        handleApplyHighlight(e.target.value, false)
                      }
                      aria-label="Selector de resaltado libre"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </label>
                  <input
                    type="text"
                    value={customHighlightHexInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomHighlightHexInput(val);
                      if (isValidHex(val)) {
                        handleApplyHighlight(val, false);
                      }
                    }}
                    placeholder="#E0F2FE"
                    aria-label="Código HEX de resaltado"
                    className="min-w-0 flex-1 h-8 px-2.5 bg-[#FFFFFF] border border-neutral-300 text-xs font-mono text-[#1C1C1A] rounded-none focus:outline-none focus:border-[#099AD7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isValidHex(customHighlightHexInput)) {
                        handleApplyHighlight(customHighlightHexInput, true);
                      } else {
                        setOpenMenu(null);
                      }
                    }}
                    className="h-8 px-3 bg-[#099AD7] text-white text-[11px] uppercase tracking-wider font-medium rounded-none hover:bg-[#0886BC] shrink-0"
                  >
                    OK
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResetHighlight}
                  className="w-full py-1 px-2 text-left text-[11px] text-[#686661] hover:bg-neutral-100 hover:text-[#1C1C1A] border-t border-neutral-100 pt-2"
                >
                  Quitar resaltado
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra emergente para "+ AGREGAR TIPOGRAFÍA" */}
      {isAddFontOpen && (
        <div className="px-3 py-2.5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#099AD7] font-semibold">
            Nueva tipografía (Google Fonts):
          </span>
          <input
            type="text"
            value={newFontNameInput}
            onChange={(e) => setNewFontNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomFont();
              } else if (e.key === "Escape") {
                setIsAddFontOpen(false);
              }
            }}
            placeholder="Ej. Playfair Display, Inter, Cinzel..."
            autoFocus
            className="flex-1 min-w-[180px] h-8 px-2.5 bg-[#FFFFFF] border border-neutral-300 text-xs text-[#1C1C1A] rounded-none focus:outline-none focus:border-[#099AD7]"
          />
          <button
            type="button"
            onClick={handleAddCustomFont}
            disabled={!newFontNameInput.trim()}
            className="h-8 px-3.5 bg-[#099AD7] hover:bg-[#0886BC] text-white text-[11px] uppercase tracking-wider font-medium rounded-none transition-colors disabled:opacity-40"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAddFontOpen(false);
              setNewFontNameInput("");
            }}
            aria-label="Cancelar nueva tipografía"
            className="h-8 w-8 inline-flex items-center justify-center border border-neutral-300 bg-[#FFFFFF] text-[#686661] hover:text-[#1C1C1A]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Área editable */}
      <EditorContent editor={editor} />
    </div>
  );
}
