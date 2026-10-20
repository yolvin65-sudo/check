const svgToDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const DEMO_SIGNATURES = {
  driver: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
      <path d="M20,65 Q50,15 80,50 T130,45 T170,60 T220,35 Q250,20 275,55" fill="none" stroke="#002d5c" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M40,75 L180,68" fill="none" stroke="#002d5c" stroke-width="2" stroke-linecap="round"/>
      <circle cx="270" cy="55" r="2.5" fill="#002d5c"/>
    </svg>
  `),
  supervisor: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
      <path d="M30,50 Q60,10 90,65 T140,30 T190,70 T240,40 Q260,25 280,60" fill="none" stroke="#004b93" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M60,80 L250,70" fill="none" stroke="#004b93" stroke-width="2" stroke-linecap="round"/>
      <!-- Small official stamp indicator -->
      <text x="210" y="92" font-family="sans-serif" font-size="9" font-weight="bold" fill="#004b93">AUTORIZADO STR</text>
    </svg>
  `),
  security: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
      <path d="M25,60 Q55,20 85,55 T135,35 T175,70 T230,25 Q255,15 270,50" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M35,78 L200,72" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
      <text x="180" y="92" font-family="sans-serif" font-size="9" font-weight="bold" fill="#475569">GARITA OK</text>
    </svg>
  `),
};
