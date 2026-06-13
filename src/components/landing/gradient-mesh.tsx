export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* SVG gradient mesh — cream, sage, sky, teal, coral */}
      <svg
        viewBox="0 0 1440 800"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="mesh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f0e6" /> {/* canvas-cream */}
            <stop offset="25%" stopColor="#a3a33b" stopOpacity="0.4" /> {/* lemon/sage */}
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" /> {/* sky */}
            <stop offset="75%" stopColor="#0d9488" stopOpacity="0.4" /> {/* primary */}
            <stop offset="100%" stopColor="#e8573a" stopOpacity="0.3" /> {/* coral */}
          </linearGradient>
          
          {/* Organic blob shapes for depth */}
          <filter id="blur">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#mesh-gradient)" />
        
        {/* Organic blobs */}
        <ellipse cx="20%" cy="30%" rx="300" ry="200" fill="#a3a33b" fillOpacity="0.15" filter="url(#blur)" />
        <ellipse cx="70%" cy="25%" rx="350" ry="250" fill="#38bdf8" fillOpacity="0.2" filter="url(#blur)" />
        <ellipse cx="85%" cy="60%" rx="250" ry="180" fill="#e8573a" fillOpacity="0.15" filter="url(#blur)" />
        <ellipse cx="40%" cy="70%" rx="280" ry="190" fill="#0d9488" fillOpacity="0.2" filter="url(#blur)" />
      </svg>
    </div>
  )
}
