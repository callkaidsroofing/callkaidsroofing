interface GraphicProps {
  color?: string;
  opacity?: number;
}

export const RoofSilhouette = ({ color = 'currentColor', opacity = 1 }: GraphicProps) => (
  <svg
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    style={{ opacity }}
  >
    {/* Main roof outline */}
    <path
      d="M200 50 L350 180 L340 190 L200 80 L60 190 L50 180 Z"
      fill={color}
      fillOpacity="0.3"
    />
    <path
      d="M200 80 L340 190 L340 280 L60 280 L60 190 Z"
      fill={color}
      fillOpacity="0.2"
    />
    {/* Roof ridge lines */}
    <line x1="200" y1="80" x2="340" y2="190" stroke={color} strokeWidth="2" opacity="0.4" />
    <line x1="200" y1="80" x2="60" y2="190" stroke={color} strokeWidth="2" opacity="0.4" />
    {/* Tile pattern hints */}
    <g opacity="0.3">
      <line x1="80" y1="210" x2="320" y2="210" stroke={color} strokeWidth="1.5" />
      <line x1="80" y1="240" x2="320" y2="240" stroke={color} strokeWidth="1.5" />
      <line x1="80" y1="270" x2="320" y2="270" stroke={color} strokeWidth="1.5" />
    </g>
    {/* Chimney */}
    <rect x="260" y="140" width="40" height="60" fill={color} opacity="0.4" />
    <rect x="255" y="135" width="50" height="8" fill={color} opacity="0.5" />
  </svg>
);

export const TilePattern = ({ color = 'currentColor', opacity = 1 }: GraphicProps) => (
  <svg
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    style={{ opacity }}
  >
    {/* Hexagonal tile grid */}
    <defs>
      <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon
          points="30,0 55,13 55,39 30,52 5,39 5,13"
          stroke={color}
          strokeWidth="2"
          fill={color}
          fillOpacity="0.1"
        />
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#hexPattern)" />
    
    {/* Accent tiles with shine effect */}
    <g opacity="0.4">
      <polygon points="90,80 115,93 115,119 90,132 65,119 65,93" fill={color} fillOpacity="0.3" />
      <polygon points="210,160 235,173 235,199 210,212 185,199 185,173" fill={color} fillOpacity="0.4" />
      <polygon points="150,280 175,293 175,319 150,332 125,319 125,293" fill={color} fillOpacity="0.35" />
      <polygon points="310,200 335,213 335,239 310,252 285,239 285,213" fill={color} fillOpacity="0.45" />
    </g>
    
    {/* Metallic shine lines */}
    <g opacity="0.2">
      <line x1="0" y1="100" x2="400" y2="0" stroke={color} strokeWidth="1" />
      <line x1="0" y1="250" x2="400" y2="150" stroke={color} strokeWidth="1" />
      <line x1="0" y1="400" x2="400" y2="300" stroke={color} strokeWidth="1" />
    </g>
  </svg>
);

export const GeometricGrid = ({ color = 'currentColor', opacity = 1 }: GraphicProps) => (
  <svg
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    style={{ opacity }}
  >
    {/* Metal rivet grid pattern */}
    <defs>
      <pattern id="gridPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <circle cx="25" cy="25" r="3" fill={color} opacity="0.3" />
        <circle cx="25" cy="25" r="5" stroke={color} strokeWidth="1" opacity="0.2" />
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#gridPattern)" />
    
    {/* Diagonal support beams */}
    <g opacity="0.15">
      <line x1="0" y1="0" x2="400" y2="400" stroke={color} strokeWidth="3" />
      <line x1="400" y1="0" x2="0" y2="400" stroke={color} strokeWidth="3" />
      <line x1="200" y1="0" x2="400" y2="200" stroke={color} strokeWidth="2" />
      <line x1="0" y1="200" x2="200" y2="400" stroke={color} strokeWidth="2" />
    </g>
    
    {/* Corner reinforcement plates */}
    <g opacity="0.25">
      <rect x="10" y="10" width="60" height="60" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
      <rect x="330" y="10" width="60" height="60" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
      <rect x="10" y="330" width="60" height="60" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
      <rect x="330" y="330" width="60" height="60" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
    </g>
    
    {/* Central mesh detail */}
    <g opacity="0.2">
      <circle cx="200" cy="200" r="80" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="200" cy="200" r="60" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="200" cy="200" r="40" stroke={color} strokeWidth="1" fill="none" />
      <line x1="120" y1="200" x2="280" y2="200" stroke={color} strokeWidth="1" />
      <line x1="200" y1="120" x2="200" y2="280" stroke={color} strokeWidth="1" />
    </g>
  </svg>
);

export const FloatingShapes = ({ color = 'currentColor', opacity = 1 }: GraphicProps) => (
  <svg
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    style={{ opacity }}
  >
    {/* Abstract floating geometric shapes */}
    {/* Small triangles */}
    <g opacity="0.3">
      <polygon points="80,60 100,100 60,100" fill={color} />
      <polygon points="320,80 340,120 300,120" fill={color} />
      <polygon points="150,300 170,340 130,340" fill={color} />
      <polygon points="280,250 300,290 260,290" fill={color} />
    </g>
    
    {/* Circles */}
    <g opacity="0.25">
      <circle cx="200" cy="100" r="15" fill={color} />
      <circle cx="100" cy="200" r="12" fill={color} />
      <circle cx="300" cy="300" r="18" fill={color} />
      <circle cx="350" cy="180" r="10" fill={color} />
    </g>
    
    {/* Squares/Rectangles */}
    <g opacity="0.2">
      <rect x="50" y="250" width="30" height="30" fill={color} transform="rotate(15 65 265)" />
      <rect x="250" y="150" width="25" height="25" fill={color} transform="rotate(-20 262.5 162.5)" />
      <rect x="180" y="220" width="35" height="35" fill={color} transform="rotate(30 197.5 237.5)" />
    </g>
    
    {/* Hexagons */}
    <g opacity="0.28">
      <polygon points="140,140 155,150 155,170 140,180 125,170 125,150" fill={color} />
      <polygon points="310,220 325,230 325,250 310,260 295,250 295,230" fill={color} />
    </g>
    
    {/* Connecting lines (subtle) */}
    <g opacity="0.1" stroke={color} strokeWidth="1">
      <line x1="80" y1="80" x2="200" y2="100" />
      <line x1="200" y1="100" x2="320" y2="100" />
      <line x1="100" y1="200" x2="140" y2="160" />
      <line x1="300" y1="300" x2="310" y2="240" />
      <line x1="150" y1="320" x2="280" y2="270" />
    </g>
  </svg>
);
