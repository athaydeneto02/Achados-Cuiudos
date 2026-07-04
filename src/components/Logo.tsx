import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  customImageUrl?: string;
  logoZoom?: number;
  logoYOffset?: number;
}

export default function Logo({ className = '', size, customImageUrl, logoZoom = 100, logoYOffset = 0 }: LogoProps) {
  const finalSize = size || (customImageUrl ? undefined : 48);

  if (customImageUrl) {
    const scale = logoZoom / 100;
    return (
      <div 
        className={`relative flex items-center justify-center rounded-full select-none shrink-0 overflow-hidden ${className}`} 
        style={{ 
          width: finalSize || '100%', 
          height: finalSize || '100%',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        }}
      >
        <img 
          src={customImageUrl} 
          alt="Logo" 
          className="w-full h-full object-cover rounded-full"
          style={{
            transform: `scale(${scale}) translateY(${logoYOffset}%)`,
            transition: 'transform 0.15s ease-out',
            imageRendering: 'auto',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitTransformStyle: 'preserve-3d',
            transformStyle: 'preserve-3d',
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <svg
      width={finalSize || 48}
      height={finalSize || 48}
      viewBox="0 0 200 200"
      className={`select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Golden Rope Ring border */}
      <circle cx="100" cy="100" r="95" fill="#0d2417" stroke="#e0b034" strokeWidth="4.5" />
      <circle cx="100" cy="100" r="90.5" fill="none" stroke="#997312" strokeWidth="1.5" strokeDasharray="3,2" />

      {/* Dark Forest Green Background for Text Ring */}
      <circle cx="100" cy="100" r="89" fill="#0c1d13" />

      {/* Invisible Paths for Curved Text */}
      {/* Top curved path (left-to-right clockwise) */}
      <path
        id="curve-top"
        d="M 18,100 A 82,82 0 0,1 182,100"
        fill="none"
      />
      {/* Bottom curved path (right-to-left counter-clockwise for upright text) */}
      <path
        id="curve-bottom"
        d="M 182,100 A 82,82 0 0,1 18,100"
        fill="none"
      />

      {/* Curved Typography */}
      <text fill="#fae896" fontSize="13" fontWeight="900" fontFamily="'Space Grotesk', 'Inter', sans-serif" letterSpacing="4.2">
        <textPath href="#curve-top" startOffset="50%" textAnchor="middle">
          ACHADOS DO CUIUDO
        </textPath>
      </text>

      <text fill="#e6d485" fontSize="10.5" fontWeight="900" fontFamily="'Space Grotesk', 'Inter', sans-serif" letterSpacing="3">
        <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">
          O MELHOR DO CAMPO
        </textPath>
      </text>

      {/* Inner Ring Divider */}
      <circle cx="100" cy="100" r="69" fill="#11291b" stroke="#e0b034" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="65.5" fill="#143020" />

      {/* Golden Wheat accents on the sides */}
      {/* Left side wheat branch */}
      <g transform="translate(36, 100) scale(0.65)" fill="#e0b034">
        <circle cx="0" cy="-20" r="2.5" />
        <circle cx="-5" cy="-12" r="2.5" />
        <circle cx="5" cy="-12" r="2.5" />
        <circle cx="-6" cy="-4" r="2.5" />
        <circle cx="6" cy="-4" r="2.5" />
        <circle cx="-5" cy="4" r="2.5" />
        <circle cx="5" cy="4" r="2.5" />
        <line x1="0" y1="-25" x2="0" y2="12" stroke="#e0b034" strokeWidth="1" />
      </g>
      {/* Right side wheat branch */}
      <g transform="translate(164, 100) scale(0.65)" fill="#e0b034">
        <circle cx="0" cy="-20" r="2.5" />
        <circle cx="-5" cy="-12" r="2.5" />
        <circle cx="5" cy="-12" r="2.5" />
        <circle cx="-6" cy="-4" r="2.5" />
        <circle cx="6" cy="-4" r="2.5" />
        <circle cx="-5" cy="4" r="2.5" />
        <circle cx="5" cy="4" r="2.5" />
        <line x1="0" y1="-25" x2="0" y2="12" stroke="#e0b034" strokeWidth="1" />
      </g>

      {/* Cowboy Illustration Group or Custom User Image */}
      {customImageUrl ? (
        <g id="custom-logo-image">
          <defs>
            <clipPath id="inner-circle-clip">
              <circle cx="100" cy="100" r="65.5" />
            </clipPath>
          </defs>
          <image
            href={customImageUrl}
            x="34.5"
            y="34.5"
            width="131"
            height="131"
            clipPath="url(#inner-circle-clip)"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      ) : (
        <g id="cowboy-character">
          {/* Body/Shirt */}
          {/* Plaid Shirt Collar and Chest */}
          <path d="M 65,160 L 135,160 L 130,132 L 100,140 L 70,132 Z" fill="#2d523b" stroke="#0d1f14" strokeWidth="1.5" />
          {/* Yellow Plaid Lines */}
          <path d="M 85,134 L 85,160" stroke="#f1c40f" strokeWidth="1" opacity="0.6" />
          <path d="M 115,134 L 115,160" stroke="#f1c40f" strokeWidth="1" opacity="0.6" />
          <path d="M 70,146 L 130,146" stroke="#f1c40f" strokeWidth="1" opacity="0.6" />
          {/* V-neck skin */}
          <path d="M 88,124 L 112,124 L 100,138 Z" fill="#e8b18a" />
          {/* Collar Flaps */}
          <path d="M 84,124 L 70,136 L 86,134 Z" fill="#1e3828" stroke="#0d1f14" strokeWidth="1" />
          <path d="M 116,124 L 130,136 L 114,134 Z" fill="#1e3828" stroke="#0d1f14" strokeWidth="1" />

          {/* Neck */}
          <rect x="88" y="112" width="24" height="15" fill="#dfa27a" />
          <path d="M 88,118 Q 100,126 112,118" fill="none" stroke="#bc815b" strokeWidth="1.5" />

          {/* Head Base */}
          <path d="M 72,95 C 72,120 128,120 128,95 C 128,78 72,78 72,95 Z" fill="#e8b18a" />

          {/* Ears */}
          <circle cx="71" cy="98" r="6" fill="#dfa27a" />
          <circle cx="129" cy="98" r="6" fill="#dfa27a" />

          {/* Dark Beard & Mustache */}
          {/* Full thick beard wrapping jawline */}
          <path d="M 72,92 C 72,125 128,125 128,92 C 128,128 72,128 72,92 Z" fill="#1a1e1b" />
          {/* Inner detail of beard */}
          <path d="M 76,96 C 76,121 124,121 124,96 C 121,118 79,118 76,96 Z" fill="#2c332f" />
          {/* Mustache */}
          <path d="M 86,111 Q 100,104 114,111 Q 100,116 86,111 Z" fill="#1a1e1b" />
          {/* Mouth/Lips space */}
          <path d="M 94,114 Q 100,117 106,114" fill="none" stroke="#dfa27a" strokeWidth="1.5" />

          {/* Nose */}
          <path d="M 97,97 Q 100,103 103,97" fill="none" stroke="#bc815b" strokeWidth="2" />

          {/* Dark Sunglasses (Cool aviator style) */}
          {/* Left lens */}
          <path d="M 76,90 C 76,82 92,82 92,90 C 92,97 76,97 76,90 Z" fill="#111111" stroke="#e0b034" strokeWidth="1" />
          {/* Right lens */}
          <path d="M 108,90 C 108,82 124,82 124,90 C 124,97 108,97 108,90 Z" fill="#111111" stroke="#e0b034" strokeWidth="1" />
          {/* Bridge */}
          <rect x="92" y="86" width="16" height="2" fill="#e0b034" />
          {/* Sunglasses gloss reflection */}
          <path d="M 79,86 L 84,94" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M 111,86 L 116,94" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

          {/* Cowboy Hat (Tan/Beige) */}
          {/* Hat Crown (Top tall fold) */}
          <path d="M 75,76 C 75,44 85,38 100,43 C 115,38 125,44 125,76 Z" fill="#d7ba91" stroke="#2c1e14" strokeWidth="1.5" />
          <path d="M 93,42 C 100,50 100,76 100,76" fill="none" stroke="#b6956c" strokeWidth="2" /> {/* Crease shadow */}
          {/* Dark Brown Hat Band */}
          <path d="M 75,72 C 85,76 115,76 125,72 L 126,77 C 116,81 84,81 74,77 Z" fill="#583110" />
          {/* Hat Brim (Curved upwards on sides) */}
          <path d="M 52,78 C 65,71 135,71 148,78 C 158,80 148,88 100,88 C 52,88 42,80 52,78 Z" fill="#e0c7a3" stroke="#2c1e14" strokeWidth="1.5" />
          {/* Hat Brim Underside Shadow */}
          <path d="M 52,79 C 65,73 135,73 148,79 C 144,83 132,84 100,84 C 68,84 56,83 52,79 Z" fill="#c3a378" opacity="0.7" />

          {/* Hand holding coupon on the left */}
          <g id="hand-coupon" transform="translate(54, 120)">
            {/* Yellow/Golden Coupon Ticket */}
            <rect x="-8" y="0" width="34" height="20" rx="2" fill="#ffd54f" stroke="#795548" strokeWidth="1" transform="rotate(-15)" />
            {/* Coupon text/decorations */}
            <text x="9" y="8" fill="#5d4037" fontSize="5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-15)" letterSpacing="0.2">
              100% OFF
            </text>
            <text x="9" y="14" fill="#8d6e63" fontSize="3" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-15)">
              CUPOM
            </text>
            {/* Side ticket cutout notches */}
            <circle cx="-9" cy="8" r="2.5" fill="#143020" />
            <circle cx="25" cy="-1" r="2.5" fill="#143020" />

            {/* Hand/Fingers gripping it */}
            <path d="M -10,12 C -6,12 -2,10 -2,4" fill="none" stroke="#e8b18a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="-5" cy="8" r="2" fill="#e8b18a" />
            <circle cx="-3" cy="11" r="2" fill="#e8b18a" />
            <circle cx="-3" cy="14" r="2" fill="#e8b18a" />
          </g>

          {/* Hand pointing to the coupon on the right */}
          <g id="hand-pointing" transform="translate(132, 128)">
            {/* Hand base */}
            <path d="M 0,10 C 2,12 8,14 12,6 C 14,2 10,-2 6,2" fill="#e8b18a" stroke="#0d1f14" strokeWidth="1" />
            {/* Index Finger pointing left */}
            <path d="M 2,4 L -18,2 C -21,2 -21,-1 -18,-1 L 0,1" fill="#e8b18a" stroke="#0d1f14" strokeWidth="1" strokeLinecap="round" />
            {/* Thumb folded */}
            <path d="M 2,-1 C 4,-5 8,-5 8,-1" fill="none" stroke="#e8b18a" strokeWidth="2.5" strokeLinecap="round" />
            {/* Other fingers folded */}
            <circle cx="5" cy="5" r="2" fill="#e8b18a" />
            <circle cx="3" cy="8" r="2" fill="#e8b18a" />
          </g>
        </g>
      )}
    </svg>
  );
}
