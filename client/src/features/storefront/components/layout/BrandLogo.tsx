import { useId } from 'react';

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = '' }: BrandLogoProps) {
  const svgId = useId().replace(/:/g, '');
  const gradientId = `brandLogoGold-${svgId}`;
  const shadowId = `brandLogoSoftShadow-${svgId}`;

  return (
    <svg viewBox="0 0 260 210" role="img" aria-label="Yara Souza Semijoias" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="44" y1="20" x2="210" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8A5A15" />
          <stop offset="0.34" stopColor="#E7BD57" />
          <stop offset="0.58" stopColor="#A66C18" />
          <stop offset="1" stopColor="#F1CF78" />
        </linearGradient>
        <filter id={shadowId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#8A5A15" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        <text
          x="36"
          y="152"
          fill={`url(#${gradientId})`}
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="168"
          fontWeight="600"
          letterSpacing="-12"
        >
          Y
        </text>
        <text
          x="116"
          y="164"
          fill={`url(#${gradientId})`}
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="156"
          fontWeight="500"
          letterSpacing="-8"
        >
          S
        </text>

        <path
          d="M73 142c25 18 65 16 91-6"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          strokeLinecap="round"
        />

        <g fill="none" stroke={`url(#${gradientId})`} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M24 125h47l17 18-40 36-40-36 16-18Z" />
          <path d="M24 125l24 54 23-54" />
          <path d="M8 143h80" />
          <path d="M39 125l-15 18" />
          <path d="M56 125l15 18" />
        </g>

        <g fill={`url(#${gradientId})`}>
          <path d="M211 58l6 19 19 6-19 6-6 19-6-19-19-6 19-6 6-19Z" />
          <path d="M236 72l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" opacity="0.78" />
        </g>
      </g>
    </svg>
  );
}
