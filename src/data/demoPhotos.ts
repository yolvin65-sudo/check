// High fidelity vector representations of Steren fleet inspection photos
// These render crisply in offline mode, export to PDF, and support full-res lightbox zoom

const svgToDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const DEMO_PHOTOS: Record<string, string> = {
  foto_frontal: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="#e2e8f0"/>
      <!-- Background / Sky & Ground -->
      <rect y="0" width="600" height="380" fill="#cbd5e1"/>
      <rect y="380" width="600" height="220" fill="#64748b"/>
      <line x1="0" y1="380" x2="600" y2="380" stroke="#475569" stroke-width="4"/>
      <!-- Vehicle Body Front: Van -->
      <rect x="130" y="160" width="340" height="260" rx="28" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>
      <!-- Windshield -->
      <path d="M155,270 L170,180 L430,180 L445,270 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" stroke-width="3"/>
      <!-- Rearview Mirrors -->
      <rect x="90" y="240" width="35" height="45" rx="8" fill="#1e293b"/>
      <rect x="475" y="240" width="35" height="45" rx="8" fill="#1e293b"/>
      <!-- Grille -->
      <rect x="200" y="315" width="200" height="45" rx="6" fill="#004b93"/>
      <!-- Steren Brand Logo on Front -->
      <text x="300" y="343" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle" letter-spacing="2">STEREN</text>
      <!-- Headlights -->
      <rect x="145" y="305" width="45" height="35" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <rect x="410" y="305" width="45" height="35" rx="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <!-- Bumper -->
      <rect x="120" y="365" width="360" height="55" rx="12" fill="#334155"/>
      <!-- License Plate -->
      <rect x="250" y="380" width="100" height="32" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <text x="300" y="401" font-family="monospace" font-weight="bold" font-size="14" fill="#0f172a" text-anchor="middle">C-784BPK</text>
      <!-- Wheels Front -->
      <rect x="135" y="420" width="40" height="30" rx="6" fill="#0f172a"/>
      <rect x="425" y="420" width="40" height="30" rx="6" fill="#0f172a"/>
      <!-- Watermark Badge -->
      <rect x="15" y="15" width="220" height="34" rx="6" fill="#002d5c" opacity="0.9"/>
      <text x="25" y="37" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff">STEREN FLOTA · FRONTAL</text>
    </svg>
  `),

  foto_trasera: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="#e2e8f0"/>
      <rect y="0" width="600" height="380" fill="#cbd5e1"/>
      <rect y="380" width="600" height="220" fill="#64748b"/>
      <!-- Van Rear Body -->
      <rect x="130" y="150" width="340" height="270" rx="18" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>
      <!-- Vertical Split Doors -->
      <line x1="300" y1="150" x2="300" y2="420" stroke="#94a3b8" stroke-width="3"/>
      <!-- Rear Windows -->
      <rect x="155" y="175" width="130" height="90" rx="8" fill="#0284c7" opacity="0.75"/>
      <rect x="315" y="175" width="130" height="90" rx="8" fill="#0284c7" opacity="0.75"/>
      <!-- Steren Brand Logo Rear -->
      <text x="220" y="315" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#004b93">STEREN</text>
      <text x="220" y="333" font-family="sans-serif" font-size="10" fill="#64748b" font-weight="bold">www.steren.com.gt</text>
      <!-- Unit Number -->
      <rect x="400" y="295" width="45" height="24" rx="4" fill="#004b93"/>
      <text x="422" y="311" font-family="sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">#14</text>
      <!-- Tail lights -->
      <rect x="135" y="270" width="16" height="75" rx="4" fill="#dc2626"/>
      <rect x="449" y="270" width="16" height="75" rx="4" fill="#dc2626"/>
      <!-- Rear Bumper -->
      <rect x="120" y="375" width="360" height="45" rx="10" fill="#334155"/>
      <!-- Rear Plate -->
      <rect x="250" y="385" width="100" height="30" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <text x="300" y="405" font-family="monospace" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">C-784BPK</text>
      <!-- Wheels -->
      <rect x="140" y="420" width="35" height="25" rx="4" fill="#0f172a"/>
      <rect x="425" y="420" width="35" height="25" rx="4" fill="#0f172a"/>
      <!-- Watermark -->
      <rect x="15" y="15" width="220" height="34" rx="6" fill="#002d5c" opacity="0.9"/>
      <text x="25" y="37" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff">STEREN FLOTA · TRASERA</text>
    </svg>
  `),

  foto_lateral_izq: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="#e2e8f0"/>
      <rect y="0" width="600" height="380" fill="#cbd5e1"/>
      <rect y="380" width="600" height="220" fill="#64748b"/>
      <!-- Van Side Profile Left -->
      <path d="M70,390 L110,230 L190,170 L510,170 L520,390 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>
      <!-- Front Cab Window -->
      <path d="M125,235 L180,185 L225,185 L225,245 L135,245 Z" fill="#38bdf8" opacity="0.8"/>
      <!-- Side Decorative Corporate Graphic -->
      <path d="M250,220 L480,220 L450,280 L220,280 Z" fill="#004b93"/>
      <text x="340" y="260" font-family="Arial, sans-serif" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle" letter-spacing="3">STEREN</text>
      <text x="340" y="315" font-family="sans-serif" font-weight="bold" font-size="12" fill="#004b93" text-anchor="middle">SOLUCIONES EN TECNOLOGÍA</text>
      <!-- Wheels with Rims -->
      <circle cx="160" cy="390" r="45" fill="#0f172a"/>
      <circle cx="160" cy="390" r="24" fill="#94a3b8"/>
      <circle cx="440" cy="390" r="45" fill="#0f172a"/>
      <circle cx="440" cy="390" r="24" fill="#94a3b8"/>
      <!-- Watermark -->
      <rect x="15" y="15" width="240" height="34" rx="6" fill="#002d5c" opacity="0.9"/>
      <text x="25" y="37" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff">STEREN FLOTA · LATERAL IZQ.</text>
    </svg>
  `),

  foto_lateral_der: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="#e2e8f0"/>
      <rect y="0" width="600" height="380" fill="#cbd5e1"/>
      <rect y="380" width="600" height="220" fill="#64748b"/>
      <!-- Van Side Profile Right (Sliding Cargo Door) -->
      <path d="M530,390 L490,230 L410,170 L90,170 L80,390 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>
      <!-- Front Cab Window -->
      <path d="M475,235 L420,185 L375,185 L375,245 L465,245 Z" fill="#38bdf8" opacity="0.8"/>
      <!-- Sliding Door Seam -->
      <rect x="170" y="180" width="160" height="205" fill="none" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="315" y="270" width="10" height="25" rx="3" fill="#334155"/>
      <!-- Side Graphic -->
      <path d="M120,220 L350,220 L320,280 L90,280 Z" fill="#004b93"/>
      <text x="215" y="260" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="3">STEREN</text>
      <!-- Wheels -->
      <circle cx="440" cy="390" r="45" fill="#0f172a"/>
      <circle cx="440" cy="390" r="24" fill="#94a3b8"/>
      <circle cx="160" cy="390" r="45" fill="#0f172a"/>
      <circle cx="160" cy="390" r="24" fill="#94a3b8"/>
      <!-- Watermark -->
      <rect x="15" y="15" width="240" height="34" rx="6" fill="#002d5c" opacity="0.9"/>
      <text x="25" y="37" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff">STEREN FLOTA · LATERAL DER.</text>
    </svg>
  `),

  foto_odometro: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="#0f172a"/>
      <!-- Instrument Cluster Bezel -->
      <circle cx="300" cy="270" r="190" fill="#1e293b" stroke="#334155" stroke-width="6"/>
      <circle cx="300" cy="270" r="160" fill="#090d16" stroke="#004b93" stroke-width="2"/>
      <!-- Speedometer Ticks -->
      <text x="300" y="200" font-family="sans-serif" font-weight="bold" font-size="18" fill="#64748b" text-anchor="middle">km/h</text>
      <!-- Digital Odometer Box -->
      <rect x="200" y="280" width="200" height="60" rx="8" fill="#020617" stroke="#38bdf8" stroke-width="2"/>
      <text x="300" y="322" font-family="monospace" font-weight="bold" font-size="26" fill="#38bdf8" text-anchor="middle" letter-spacing="3">142,580 km</text>
      <!-- Fuel Gauge Mini Dial -->
      <rect x="230" y="365" width="140" height="24" rx="6" fill="#1e293b"/>
      <rect x="232" y="367" width="105" height="20" rx="4" fill="#10b981"/>
      <text x="215" y="382" font-family="sans-serif" font-weight="bold" font-size="13" fill="#f87171">E</text>
      <text x="385" y="382" font-family="sans-serif" font-weight="bold" font-size="13" fill="#34d399">F</text>
      <!-- Status Lights -->
      <circle cx="210" cy="240" r="8" fill="#10b981"/>
      <circle cx="390" cy="240" r="8" fill="#38bdf8"/>
      <!-- Bottom banner -->
      <rect x="150" y="470" width="300" height="40" rx="6" fill="#1e293b"/>
      <text x="300" y="495" font-family="sans-serif" font-weight="bold" font-size="13" fill="#94a3b8" text-anchor="middle">TABLERO OPERATIVO NORMAL</text>
      <!-- Watermark -->
      <rect x="15" y="15" width="250" height="34" rx="6" fill="#004b93" opacity="0.9"/>
      <text x="25" y="37" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff">ODÓMETRO &amp; INDICADORES</text>
    </svg>
  `),

  foto_carga: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="#334155"/>
      <!-- Cargo Interior Van Ribs -->
      <rect x="60" y="80" width="480" height="440" rx="12" fill="#475569" stroke="#64748b" stroke-width="4"/>
      <line x1="160" y1="80" x2="160" y2="520" stroke="#334155" stroke-width="4"/>
      <line x1="300" y1="80" x2="300" y2="520" stroke="#334155" stroke-width="4"/>
      <line x1="440" y1="80" x2="440" y2="520" stroke="#334155" stroke-width="4"/>
      <!-- Floor Cargo Deck -->
      <rect x="60" y="420" width="480" height="100" fill="#1e293b"/>
      <!-- Steren Electronics Cargo Boxes -->
      <rect x="120" y="300" width="150" height="130" fill="#d97706" stroke="#b45309" stroke-width="3"/>
      <text x="195" y="365" font-family="sans-serif" font-weight="bold" font-size="15" fill="#ffffff" text-anchor="middle">STEREN</text>
      <text x="195" y="385" font-family="sans-serif" font-size="10" fill="#ffffff" text-anchor="middle">AUDIO &amp; CABLES</text>
      
      <rect x="290" y="270" width="180" height="160" fill="#0284c7" stroke="#0369a1" stroke-width="3"/>
      <text x="380" y="340" font-family="sans-serif" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="middle">STEREN</text>
      <text x="380" y="365" font-family="sans-serif" font-size="11" fill="#ffffff" text-anchor="middle">COMPUTO / REDES</text>

      <!-- Yellow Tie-Down Cargo Straps -->
      <line x1="90" y1="360" x2="500" y2="360" stroke="#eab308" stroke-width="6"/>
      <line x1="90" y1="320" x2="500" y2="320" stroke="#eab308" stroke-width="4"/>
      <!-- Watermark -->
      <rect x="15" y="15" width="250" height="34" rx="6" fill="#002d5c" opacity="0.9"/>
      <text x="25" y="37" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff">COMPARTIMENTO DE CARGA</text>
    </svg>
  `),

  foto_motor: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="#1e293b"/>
      <!-- Engine Bay -->
      <rect x="50" y="70" width="500" height="460" rx="16" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      <!-- Engine Block -->
      <rect x="180" y="160" width="240" height="240" rx="14" fill="#334155" stroke="#475569" stroke-width="4"/>
      <text x="300" y="260" font-family="sans-serif" font-weight="bold" font-size="18" fill="#cbd5e1" text-anchor="middle">MOTOR 2.8L</text>
      <text x="300" y="285" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">STEREN SERVICE OK</text>
      <!-- Battery with clean terminals -->
      <rect x="80" y="180" width="80" height="95" rx="6" fill="#0284c7"/>
      <circle cx="100" cy="195" r="7" fill="#dc2626"/>
      <circle cx="140" cy="195" r="7" fill="#1e293b"/>
      <text x="120" y="240" font-family="sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">BATERÍA</text>
      <!-- Coolant Tank (Translucent Green) -->
      <rect x="440" y="180" width="80" height="85" rx="10" fill="#10b981" opacity="0.8" stroke="#059669" stroke-width="2"/>
      <text x="480" y="230" font-family="sans-serif" font-weight="bold" font-size="10" fill="#ffffff" text-anchor="middle">COOLANT</text>
      <text x="480" y="245" font-family="sans-serif" font-size="9" fill="#ffffff" text-anchor="middle">NIVEL MÁX</text>
      <!-- Oil Dipstick Ring -->
      <circle cx="210" cy="140" r="12" fill="none" stroke="#eab308" stroke-width="4"/>
      <!-- Watermark -->
      <rect x="15" y="15" width="240" height="34" rx="6" fill="#002d5c" opacity="0.9"/>
      <text x="25" y="37" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff">MOTOR &amp; NIVELES FLUIDOS</text>
    </svg>
  `),

  foto_novedad: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="#f8fafc"/>
      <!-- Bumper Detail Close-up -->
      <rect x="50" y="120" width="500" height="340" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
      <!-- Plastic Bumper Texture -->
      <rect x="100" y="220" width="400" height="160" rx="12" fill="#334155"/>
      <!-- Minor Scratch Highlight -->
      <path d="M260,285 Q300,280 340,295" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
      <circle cx="300" cy="287" r="38" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4"/>
      <text x="300" y="355" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ef4444" text-anchor="middle">Rayón superficial 8 cm</text>
      <!-- Info callout -->
      <rect x="120" y="420" width="360" height="35" rx="6" fill="#fef2f2" stroke="#fecaca" stroke-width="1"/>
      <text x="300" y="442" font-family="sans-serif" font-weight="bold" font-size="11" fill="#991b1b" text-anchor="middle">PREEXISTENTE REGISTRADO EN BITÁCORA</text>
      <!-- Watermark -->
      <rect x="15" y="15" width="240" height="34" rx="6" fill="#b91c1c" opacity="0.9"/>
      <text x="25" y="37" font-family="sans-serif" font-weight="bold" font-size="13" fill="#ffffff">HALLAZGO / OBSERVACIÓN</text>
    </svg>
  `),
};

// Aliases for the 4 mandatory photos: DERECHO, IZQUIERDO, DELANTERA, TRASERA
DEMO_PHOTOS.foto_derecho = DEMO_PHOTOS.foto_lateral_der;
DEMO_PHOTOS.foto_izquierdo = DEMO_PHOTOS.foto_lateral_izq;
DEMO_PHOTOS.foto_delantera = DEMO_PHOTOS.foto_frontal;
// DEMO_PHOTOS.foto_trasera is already defined above

