
import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  isSubmitting: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  dropAreaRef: React.RefObject<HTMLDivElement>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onChange,
  isSubmitting,
  textareaRef,
  dropAreaRef,
  onDragOver,
  onDragLeave,
  onDrop
}) => (
  <div
    ref={dropAreaRef}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    className="border-2 border-dashed rounded-md transition-colors p-1"
  >
    <Textarea
      id="content"
      value={value}
      ref={textareaRef}
      onChange={e => onChange(e.target.value)}
      placeholder="Write your post content here... ALL HTML tags supported (img, code, p, h1...etc)"
      className="min-h-[300px] font-mono"
      rows={15}
      required
      disabled={isSubmitting}
    />
  </div>
);

export default ContentEditor;
