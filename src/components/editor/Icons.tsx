type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" } as const;

export const IconUp = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M6 15l6-6 6 6" />
  </svg>
);
export const IconDown = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const IconX = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconPlus = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconEye = ({ className = "size-4", off }: P & { off?: boolean }) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </svg>
);
export const IconDownload = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);
export const IconImage = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="M21 16l-5-5-9 9" />
  </svg>
);
export const IconDoc = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
export const IconShare = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" />
  </svg>
);
export const IconSparkle = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
  </svg>
);
export const IconCrown = ({ className = "size-3.5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5z" />
  </svg>
);
export const IconCheck = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const IconWarning = ({ className = "size-4" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 4l9 16H3z" />
    <path d="M12 10v4M12 17.5v.01" />
  </svg>
);
export const IconChat = ({ className = "size-5" }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </svg>
);
/** Filled heart, drawn so it never turns into an emoji glyph. */
export const IconHeart = ({ className = "size-4", style }: P & { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden fill="currentColor">
    <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.8 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.4 0 5.6 3.3 4.4 6.7-1.7 4.7-9.2 9.3-9.2 9.3z" />
  </svg>
);
