import React from "react";

interface FormatTextProps {
  text: string | undefined;
  className?: string;
}

/**
 * Renders text with basic formatting (newlines and bullet points).
 */
export function FormatText({ text, className }: FormatTextProps) {
  if (typeof text !== "string" || !text) return null;
  const lines = text.split("\n");

  return (
    <div className={className}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        if (isBullet) {
          const content = trimmed.substring(2);
          return (
            <div key={i} className="flex gap-2 items-start mt-1 first:mt-0">
              <span className="shrink-0 opacity-70 mt-1 select-none text-[10px]">•</span>
              <span className="flex-1">{content}</span>
            </div>
          );
        }
        return (
          <p key={i} className={trimmed === "" ? "h-2" : ""}>
            {line}
          </p>
        );
      })}
    </div>
  );
}
