
import React from "react";
import { Label } from "@/components/ui/label";

const ContentPreview = ({ content }) => (
  <div className="pt-4">
    <Label>Content Preview</Label>
    <div className="prose prose-lg dark:prose-invert bg-gray-50 dark:bg-zinc-900 p-4 rounded shadow-inner min-h-[120px] overflow-x-auto">
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  </div>
);

export default ContentPreview;
