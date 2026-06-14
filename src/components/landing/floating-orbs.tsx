interface Orb {
  size: number
  x: string
  y: string
  color: string
  animation: string
  duration: string
  delay: string
  opacity: number
}

const orbs: Orb[] = [
  { size: 200, x: '10%', y: '20%', color: 'bg-ember', animation: 'animate-drift', duration: '22s', delay: '0s', opacity: 0.06 },
  { size: 120, x: '75%', y: '15%', color: 'bg-ember', animation: 'animate-drift-alt', duration: '28s', delay: '-8s', opacity: 0.04 },
  { size: 280, x: '60%', y: '60%', color: 'bg-sage', animation: 'animate-drift', duration: '30s', delay: '-12s', opacity: 0.03 },
  { size: 90, x: '30%', y: '70%', color: 'bg-ember', animation: 'animate-drift-alt', duration: '18s', delay: '-4s', opacity: 0.05 },
  { size: 160, x: '85%', y: '45%', color: 'bg-sage', animation: 'animate-drift', duration: '26s', delay: '-16s', opacity: 0.03 },
  { size: 70, x: '45%', y: '10%', color: 'bg-ember', animation: 'animate-drift-alt', duration: '20s', delay: '-6s', opacity: 0.05 },
  { size: 240, x: '20%', y: '50%', color: 'bg-white', animation: 'animate-drift', duration: '32s', delay: '-20s', opacity: 0.02 },
]

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl ${orb.color} ${orb.animation}`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            opacity: orb.opacity,
            animationDuration: orb.duration,
            animationDelay: orb.delay,
          }}
        />
      ))}
    </div>
  )
}
