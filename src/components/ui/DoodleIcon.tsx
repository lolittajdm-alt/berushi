type DoodleIconProps = {
  type: "camera" | "design" | "video" | "idea" | "star" | "arrow" | "circle";
  className?: string;
};

export function DoodleIcon({ type, className = "w-6 h-6" }: DoodleIconProps) {
  const icons = {
    camera: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <rect x="2" y="6" width="20" height="14" rx="3" strokeLinecap="round" />
        <circle cx="12" cy="13" r="4" />
        <path d="M8 6L10 3h4l2 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    design: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    video: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <rect x="2" y="5" width="14" height="14" rx="2" />
        <path d="M16 10l6-3v10l-6-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    idea: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M9 18h6M10 22h4" strokeLinecap="round" />
        <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    arrow: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  };

  return icons[type];
}
