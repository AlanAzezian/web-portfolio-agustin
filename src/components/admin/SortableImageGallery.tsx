"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical } from "lucide-react";

export interface SortableGalleryItem {
  id: string;
  src: string;
  caption?: string;
  isNew?: boolean;
  file?: File;
}

export interface SortableImageGalleryProps<T extends SortableGalleryItem> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  onRemove: (id: string, index: number) => void;
  showCaption?: boolean;
  onCaptionChange?: (id: string, index: number, caption: string) => void;
  disabled?: boolean;
  columnsClassName?: string;
  aspectClassName?: string;
}

interface SortableCardProps<T extends SortableGalleryItem> {
  item: T;
  index: number;
  onRemove: (id: string, index: number) => void;
  showCaption?: boolean;
  onCaptionChange?: (id: string, index: number, caption: string) => void;
  disabled?: boolean;
  aspectClassName: string;
}

function SortableItem<T extends SortableGalleryItem>({
  item,
  index,
  onRemove,
  showCaption,
  onCaptionChange,
  disabled,
  aspectClassName,
}: SortableCardProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? "none" : transition,
  };

  const formattedBadge = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col bg-neutral-50 rounded-none select-none transition-shadow ${
        showCaption ? "p-1.5 gap-1.5" : ""
      } ${
        isDragging
          ? "opacity-50 border-2 border-[#099AD7] scale-105 shadow-lg z-50"
          : item.isNew
            ? "border border-[#099AD7]/50 hover:border-[#099AD7] z-0"
            : "border border-neutral-200 hover:border-[#099AD7]/70 z-0"
      }`}
    >
      {/* Área arrastrable de la miniatura */}
      <div
        {...attributes}
        {...listeners}
        style={{ touchAction: "none" }}
        className={`relative w-full ${aspectClassName} overflow-hidden bg-white touch-none ${
          disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        title="Arrastrar para reordenar posición"
      >
        <img
          src={item.src}
          alt={item.caption || `Imagen ${formattedBadge}`}
          draggable={false}
          className="w-full h-full object-cover pointer-events-none select-none"
        />

        {/* Indicador visual de agarre arriba a la izquierda */}
        <span
          aria-hidden="true"
          className="absolute top-1 left-1 bg-[#FFFFFF]/90 text-[#686661] group-hover:text-[#099AD7] border border-neutral-200 p-0.5 opacity-85 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          <GripVertical className="w-3 h-3" />
        </span>

        {/* Badge numérico dinámico en esquina inferior izquierda */}
        <span
          className={`absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-medium tabular-nums pointer-events-none ${
            item.isNew
              ? "bg-[#099AD7] text-white"
              : "bg-[#FFFFFF]/95 text-[#1C1C1A] border border-neutral-200"
          }`}
        >
          {formattedBadge}
        </span>

        {/* Botón de eliminar individual en esquina superior derecha */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id, index);
          }}
          disabled={disabled}
          aria-label={`Quitar imagen ${formattedBadge}`}
          title={`Quitar imagen ${formattedBadge}`}
          className="absolute top-1 right-1 z-10 bg-[#FFFFFF]/95 hover:bg-[#A84A4A] text-[#1C1C1A] hover:text-white border border-neutral-300 hover:border-[#A84A4A] p-1 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Campo de texto / epígrafe opcional inferior */}
      {showCaption && (
        <input
          type="text"
          value={item.caption ?? ""}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => onCaptionChange?.(item.id, index, e.target.value)}
          disabled={disabled}
          placeholder="Epígrafe..."
          className="w-full h-6 px-1.5 bg-[#FFFFFF] border border-neutral-200 text-[10px] text-[#1C1C1A] rounded-none focus:outline-none focus:border-[#099AD7]"
        />
      )}
    </div>
  );
}

export default function SortableImageGallery<T extends SortableGalleryItem>({
  items,
  onReorder,
  onRemove,
  showCaption = false,
  onCaptionChange,
  disabled = false,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  aspectClassName = "aspect-[4/3]",
}: SortableImageGalleryProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requiere mover al menos 5px antes de iniciar el drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((entry) => entry.id === active.id);
    const newIndex = items.findIndex((entry) => entry.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  if (items.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className={`grid ${columnsClassName} gap-3 pt-1`}>
          {items.map((item, idx) => (
            <SortableItem
              key={item.id}
              item={item}
              index={idx}
              onRemove={onRemove}
              showCaption={showCaption}
              onCaptionChange={onCaptionChange}
              disabled={disabled}
              aspectClassName={aspectClassName}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
