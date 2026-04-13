"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Layers3, Trash2 } from "lucide-react";

import { MediaLibraryModal } from "@/components/admin/cms/media-library-modal";
import { RawHtmlEditor } from "@/components/admin/cms/raw-html-editor";
import { TiptapHtmlEditor } from "@/components/admin/cms/tiptap-html-editor";
import { Button } from "@/components/ui/button";
import { SECTION_TYPES, createSection } from "@/lib/blog-content";
import { cn } from "@/lib/utils";

function SortableSection({ section, onChange, onDelete, onOpenImagePicker }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm",
        isDragging && "opacity-75 shadow-xl"
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-full bg-slate-100 p-2 text-slate-500" {...attributes} {...listeners}>
            <GripVertical className="h-4 w-4" />
          </button>
          <div>
            <p className="text-sm font-semibold capitalize text-ink">{section.type}</p>
            <p className="text-xs text-slate-500">Keo tha de doi vi tri block.</p>
          </div>
        </div>
        <button type="button" className="rounded-full bg-red-50 p-2 text-red-600" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {section.type === "heading" ? (
          <div className="grid gap-4 md:grid-cols-[140px_1fr]">
            <select
              className="admin-input"
              value={section.headingLevel}
              onChange={(event) => onChange({ ...section, headingLevel: event.target.value })}
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
            </select>
            <input
              className="admin-input"
              placeholder="Noi dung heading"
              value={section.body}
              onChange={(event) => onChange({ ...section, body: event.target.value })}
            />
          </div>
        ) : null}

        {section.type === "text" ? (
          <TiptapHtmlEditor
            value={section.body}
            onChange={(value) => onChange({ ...section, body: value })}
            placeholder="Viet noi dung section..."
          />
        ) : null}

        {section.type === "html" ? (
          <RawHtmlEditor
            value={section.body}
            onChange={(value) => onChange({ ...section, body: value })}
            placeholder="Dan custom HTML, bang gia, iframe, embed hoac noi dung co dinh dang dac biet..."
          />
        ) : null}

        {section.type === "image" ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[24px] border border-dashed border-slate-300 bg-slate-50">
              {section.image?.url ? (
                <img src={section.image.url} alt={section.image.alt || "Preview"} className="h-72 w-full object-cover" />
              ) : (
                <div className="flex h-72 flex-col items-center justify-center gap-3 text-slate-500">
                  <ImagePlus className="h-8 w-8" />
                  <p className="text-sm">Chua co anh cho section nay.</p>
                </div>
              )}
            </div>
            <Button variant="secondary" onClick={onOpenImagePicker}>
              Chon tu Media Library
            </Button>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="admin-input"
                placeholder="Alt text"
                value={section.image?.alt || ""}
                onChange={(event) =>
                  onChange({
                    ...section,
                    image: {
                      ...section.image,
                      alt: event.target.value
                    }
                  })
                }
              />
              <input
                className="admin-input"
                placeholder="Caption"
                value={section.caption || ""}
                onChange={(event) => onChange({ ...section, caption: event.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-ink">Kich thuoc</span>
                <select
                  className="admin-input"
                  value={section.imageDisplay?.width || "wide"}
                  onChange={(event) =>
                    onChange({
                      ...section,
                      imageDisplay: {
                        ...section.imageDisplay,
                        width: event.target.value
                      }
                    })
                  }
                >
                  <option value="full">Full width</option>
                  <option value="wide">Wide</option>
                  <option value="narrow">Narrow</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-ink">Ti le hien thi</span>
                <select
                  className="admin-input"
                  value={section.imageDisplay?.ratio || "landscape"}
                  onChange={(event) =>
                    onChange({
                      ...section,
                      imageDisplay: {
                        ...section.imageDisplay,
                        ratio: event.target.value
                      }
                    })
                  }
                >
                  <option value="original">Original</option>
                  <option value="landscape">Landscape</option>
                  <option value="square">Square</option>
                  <option value="portrait">Portrait</option>
                </select>
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SectionBuilder({ sections, onChange }) {
  const [imagePickerTarget, setImagePickerTarget] = useState("");
  const [lastAddedId, setLastAddedId] = useState("");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    if (!lastAddedId) return;
    const element = document.getElementById(`cms-section-${lastAddedId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [lastAddedId]);

  const appendSection = (type) => {
    const nextSection = createSection(type);
    setLastAddedId(nextSection.id);
    onChange([...sections, nextSection]);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white p-3 text-ocean shadow-sm">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Section builder</p>
              <p className="text-sm text-slate-500">{sections.length} block noi dung trong bai viet nay.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {SECTION_TYPES.map((type) => (
          <Button key={type.value} variant="secondary" onClick={() => appendSection(type.value)}>
            + {type.label}
          </Button>
        ))}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;

          const oldIndex = sections.findIndex((section) => section.id === active.id);
          const newIndex = sections.findIndex((section) => section.id === over.id);
          onChange(arrayMove(sections, oldIndex, newIndex));
        }}
      >
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} id={`cms-section-${section.id}`}>
                <SortableSection
                  section={section}
                  onChange={(nextSection) => onChange(sections.map((item) => (item.id === section.id ? nextSection : item)))}
                  onDelete={() => onChange(sections.filter((item) => item.id !== section.id))}
                  onOpenImagePicker={() => setImagePickerTarget(section.id)}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-center">
        <Button variant="secondary" onClick={() => appendSection("text")}>
          + Add another text section
        </Button>
      </div>

      <MediaLibraryModal
        open={Boolean(imagePickerTarget)}
        onOpenChange={(open) => {
          if (!open) setImagePickerTarget("");
        }}
        onSelect={(asset) => {
          onChange(
            sections.map((section) =>
              section.id === imagePickerTarget
                ? {
                    ...section,
                    image: {
                      ...asset,
                      alt: asset.alt || section.image?.alt || ""
                    }
                  }
                : section
            )
          );
          setImagePickerTarget("");
        }}
      />
    </div>
  );
}
