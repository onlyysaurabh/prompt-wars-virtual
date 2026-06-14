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
  { size: 400, x: '5%', y: '10%', color: 'bg-sage', animation: 'animate-drift', duration: '32s', delay: '0s', opacity: 0.15 },
  { size: 250, x: '80%', y: '15%', color: 'bg-ember', animation: 'animate-drift-alt', duration: '28s', delay: '-8s', opacity: 0.08 },
  { size: 500, x: '50%', y: '60%', color: 'bg-sage', animation: 'animate-drift', duration: '40s', delay: '-12s', opacity: 0.12 },
  { size: 150, x: '25%', y: '80%', color: 'bg-white', animation: 'animate-drift-alt', duration: '22s', delay: '-4s', opacity: 0.05 },
  { size: 300, x: '85%', y: '55%', color: 'bg-sage', animation: 'animate-drift', duration: '36s', delay: '-16s', opacity: 0.1 },
  { size: 200, x: '45%', y: '5%', color: 'bg-ember-deep', animation: 'animate-drift-alt', duration: '25s', delay: '-6s', opacity: 0.06 },
  { size: 350, x: '15%', y: '45%', color: 'bg-white', animation: 'animate-drift', duration: '38s', delay: '-20s', opacity: 0.04 },
]

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen" aria-hidden="true">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[100px] ${orb.color} ${orb.animation}`}
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
