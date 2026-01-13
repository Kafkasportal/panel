"use client";

import { VibeKanbanWebCompanion } from "vibe-kanban-web-companion";

/**
 * Vibe Kanban Web Companion wrapper
 * 
 * Provides component selection and preview mode integration for Vibe Kanban.
 * The VibeKanbanWebCompanion component is automatically tree-shaken from 
 * production builds by the package itself, so no manual checks are needed.
 * 
 * @see https://vibekanban.com/docs/testing-your-application
 */
export function VibeKanbanWrapper() {
  return <VibeKanbanWebCompanion />;
}
