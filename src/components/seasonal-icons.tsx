import type { CSSProperties } from 'react';

interface SeasonalIconProps {
  className?: string;
  style?: CSSProperties;
}

export function ColombiaFlag({ className, style }: SeasonalIconProps) {
  return (
    <svg
      viewBox="0 0 36 24"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <rect width="36" height="12" fill="#fcd116" />
      <rect y="12" width="36" height="6" fill="#003893" />
      <rect y="18" width="36" height="6" fill="#ce1126" />
    </svg>
  );
}
