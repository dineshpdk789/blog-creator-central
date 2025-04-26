
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Underline, Code, List, ListOrdered, Heading1,
  Heading2, Heading3, Link as LinkIcon, Image, Upload, Eye
} from "lucide-react";

const EditorToolbar = ({
  isSubmitting,
  onFormat,
  onInsertLink,
  onInsertImageByUrl,
  onClickUploadImage,
  uploading,
  showPreview,
  onTogglePreview,
}) => (
  <div className="flex flex-wrap gap-2 mb-1">
    <Button type="button" variant="outline" size="icon" title="Bold" onClick={() => onFormat("b")} disabled={isSubmitting}><Bold size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Italic" onClick={() => onFormat("i")} disabled={isSubmitting}><Italic size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Underline" onClick={() => onFormat("u")} disabled={isSubmitting}><Underline size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Code" onClick={() => onFormat("code")} disabled={isSubmitting}><Code size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Unordered List" onClick={() => onFormat("ul")} disabled={isSubmitting}><List size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Ordered List" onClick={() => onFormat("ol")} disabled={isSubmitting}><ListOrdered size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Heading 1" onClick={() => onFormat("h1")} disabled={isSubmitting}><Heading1 size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Heading 2" onClick={() => onFormat("h2")} disabled={isSubmitting}><Heading2 size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Heading 3" onClick={() => onFormat("h3")} disabled={isSubmitting}><Heading3 size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Insert Link" onClick={onInsertLink} disabled={isSubmitting}><LinkIcon size={18} /></Button>
    <Button type="button" variant="outline" size="icon" title="Insert Image by URL" onClick={onInsertImageByUrl} disabled={isSubmitting}><Image size={18} /></Button>
    <Button
      type="button"
      variant="outline"
      size="icon"
      title="Drag and drop or click to upload images"
      onClick={onClickUploadImage}
      disabled={isSubmitting || uploading}
    >
      <Upload size={18} />
    </Button>
    <Button
      type="button"
      variant={showPreview ? "secondary" : "outline"}
      size="sm"
      className="ml-4"
      onClick={onTogglePreview}
      disabled={isSubmitting}
    >
      <Eye size={16} className="mr-1" /> {showPreview ? "Hide" : "Show"} Preview
    </Button>
  </div>
);

export default EditorToolbar;
