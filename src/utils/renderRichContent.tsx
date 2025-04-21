import React from "react";

/**
 * Parses the content string for Markdown-like bold (**), italics (*),
 * underline (__), and custom Unsplash image tags [img]...[/img].
 */
export function renderRichContent(content: string): React.ReactNode[] {
  if (!content) return [];

  // Split by double newlines for paragraphs.
  const paragraphs = content.split(/\n{2,}/g);

  // Helper to parse inline formatting (recursive)
  function parseInline(text: string): React.ReactNode[] {
    // Images: [img]...[/img]
    const imgPattern = /\[img\](.+?)\[\/img\]/g;
    let imgMatch: RegExpExecArray | null, imgs = [], lastIdx = 0, children: React.ReactNode[] = [];
    let match: RegExpExecArray | null;
    let pos = 0;
    let working = text;

    // Replace image tags with <img> nodes, keep the rest for rich text parsing
    while ((match = imgPattern.exec(working))) {
      if (match.index > pos) {
        // Parse the content before the image recursively
        children = children.concat(parseMarks(working.slice(pos, match.index)));
      }
      // Insert the image
      const unsplashId = match[1];
      children.push(
        <img
          key={`img-${unsplashId}-${match.index}`}
          src={`https://images.unsplash.com/${unsplashId}`}
          alt=""
          className="my-4 rounded-lg shadow max-w-full"
          loading="lazy"
        />
      );
      pos = match.index + match[0].length;
    }

    if (pos < working.length) {
      children = children.concat(parseMarks(working.slice(pos)));
    }
    return children;
  }

  /**
   * Recursively parse inline marks (bold, italic, underline)
   * Order: bold (**), italic (*), underline (__)
   */
  function parseMarks(text: string): React.ReactNode[] {
    // Bold (**)
    const boldRegex = /\*\*(.*?)\*\*/;
    const boldMatch = boldRegex.exec(text);
    if (boldMatch) {
      const [matchStr, inner] = boldMatch;
      const before = text.slice(0, boldMatch.index);
      const after = text.slice(boldMatch.index + matchStr.length);
      return [
        ...parseMarks(before),
        <b key={"b"+boldMatch.index}>{inner}</b>,
        ...parseMarks(after),
      ];
    }

    // Underline (__)
    const underlineRegex = /__(.*?)__/;
    const underlineMatch = underlineRegex.exec(text);
    if (underlineMatch) {
      const [matchStr, inner] = underlineMatch;
      const before = text.slice(0, underlineMatch.index);
      const after = text.slice(underlineMatch.index + matchStr.length);
      return [
        ...parseMarks(before),
        <span key={"u"+underlineMatch.index} style={{ textDecoration: "underline" }}>{inner}</span>,
        ...parseMarks(after),
      ];
    }

    // Italic (*)
    const italicRegex = /\*(.*?)\*/;
    const italicMatch = italicRegex.exec(text);
    if (italicMatch) {
      const [matchStr, inner] = italicMatch;
      const before = text.slice(0, italicMatch.index);
      const after = text.slice(italicMatch.index + matchStr.length);
      return [
        ...parseMarks(before),
        <i key={"i"+italicMatch.index}>{inner}</i>,
        ...parseMarks(after),
      ];
    }

    // No more formatting, just text left
    return [text];
  }

  // Map each paragraph to a <p> with formatted children
  return paragraphs.map((para, i) => (
    <p key={i} className="mb-4 last:mb-0">{parseInline(para)}</p>
  ));
}
