import type { ToolId } from "@/content/types";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Line icons for the tools hub, drawn to match the site's ornament style. */
export function ToolIcon({ id, className = "size-7" }: { id: ToolId; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {id === "gunaMilan" && (
        <g {...s}>
          <circle cx="12" cy="16" r="7" />
          <circle cx="20" cy="16" r="7" />
          <path d="M16 11.2v9.6" strokeDasharray="1.5 2" />
        </g>
      )}
      {id === "birthChart" && (
        <g {...s}>
          <rect x="5" y="5" width="22" height="22" />
          <path d="M5 5l22 22M27 5L5 27M16 5l11 11-11 11L5 16z" />
        </g>
      )}
      {id === "invitation" && (
        <g {...s}>
          <rect x="4" y="8" width="24" height="17" rx="2" />
          <path d="M4.5 9l11.5 9 11.5-9" />
          <circle cx="16" cy="18" r="2.6" fill="currentColor" stroke="none" />
        </g>
      )}
      {id === "muhurat" && (
        <g {...s}>
          <rect x="5" y="7" width="22" height="20" rx="2" />
          <path d="M5 12.5h22M11 4.5v5M21 4.5v5" />
          <path d="M16 15.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" fill="currentColor" stroke="none" />
        </g>
      )}
      {id === "whatsapp" && (
        <g {...s}>
          <path d="M6 7h20v14H13l-7 5z" />
          <path d="M11 12h10M11 16h6" />
        </g>
      )}
      {id === "typing" && (
        <g {...s}>
          <rect x="3.5" y="9" width="25" height="15" rx="2" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M20 14h.01M24 14h.01M10 19h12" strokeWidth="2.2" />
        </g>
      )}
      {id === "height" && (
        <g {...s}>
          <rect x="11" y="3.5" width="10" height="25" rx="1.5" />
          <path d="M11 8h4M11 12.5h6M11 17h4M11 21.5h6M11 26h4" />
        </g>
      )}
      {id === "ageGap" && (
        <g {...s}>
          <path d="M10 4.5h12M10 27.5h12M11 4.5c0 6 10 7 10 11.5S11 21.5 11 27.5M21 4.5c0 6-10 7-10 11.5s10 5.5 10 11.5" />
        </g>
      )}
    </svg>
  );
}
