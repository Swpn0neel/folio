import React from "react";

/**
 * Returns initials from a full name (up to 2 characters).
 */
export function initials(name: string) {
  if (typeof name !== "string" || !name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";
}

/**
 * Renders text with basic formatting (newlines and bullet points).
 */
export function formatText(text: string | undefined): string[] {
  if (typeof text !== "string" || !text) return [];
  return text.split("\n");
}
