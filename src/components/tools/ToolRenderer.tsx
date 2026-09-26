"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ToolId } from "@/content/types";
import type { Lang } from "@/lib/i18n";

/** Placeholder shown while a tool's code chunk loads. */
function ToolLoading() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-paper p-5" role="status" aria-label="Loading">
      <div className="h-5 w-40 rounded bg-sand" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="h-24 rounded-xl bg-sand/70" />
        <div className="h-24 rounded-xl bg-sand/70" />
      </div>
      <div className="mt-4 h-10 w-32 rounded-full bg-sand" />
    </div>
  );
}

// Each tool is its own chunk, so a page only loads the tool it shows.
const TOOLS: Record<ToolId, ComponentType<{ lang: Lang }>> = {
  gunaMilan: dynamic(() => import("./GunaMilan"), { loading: ToolLoading }),
  birthChart: dynamic(() => import("./BirthChart"), { loading: ToolLoading }),
  invitation: dynamic(() => import("./InvitationMaker"), { loading: ToolLoading }),
  muhurat: dynamic(() => import("./Muhurat"), { loading: ToolLoading }),
  whatsapp: dynamic(() => import("./WhatsappBiodata"), { loading: ToolLoading }),
  typing: dynamic(() => import("./TypingTool"), { loading: ToolLoading }),
  height: dynamic(() => import("./HeightConverter"), { loading: ToolLoading }),
  ageGap: dynamic(() => import("./AgeGap"), { loading: ToolLoading }),
};

export function ToolRenderer({ tool, lang }: { tool: ToolId; lang: Lang }) {
  const Tool = TOOLS[tool];
  return <Tool lang={lang} />;
}
