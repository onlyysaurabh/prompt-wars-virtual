import Image from 'next/image'

const screenshots = [
  {
    src: '/screenshot1.png',
    alt: 'CarbonTrack dashboard showing daily emissions breakdown by category',
    caption: 'Dashboard',
  },
  {
    src: '/screenshot2.png',
    alt: 'CarbonTrack insights panel with personalized reduction tips',
    caption: 'Insights',
  },
  {
    src: '/screenshot3.png',
    alt: 'CarbonTrack action log for recording daily activities',
    caption: 'Actions',
  },
]

function DeviceFrame({ screenshot }: { screenshot: typeof screenshots[number] }) {
  return (
    <div className="group rounded-xl overflow-hidden border border-white/10 bg-midnight shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.12)] hover:scale-[1.02]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="block w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="block w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="block w-2.5 h-2.5 rounded-full bg-white/20" />
        </div>
        <div className="flex-1 mx-4">
          <div className="mx-auto max-w-[180px] h-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
            <span className="text-[10px] text-white/20 font-mono">carbontrack.app</span>
          </div>
        </div>
      </div>

      {/* Screenshot image */}
      <div className="relative aspect-[4/3] bg-midnight">
        <Image
          src={screenshot.src}
          alt={screenshot.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          className="object-cover object-top"
        />
      </div>
    </div>
  )
}

export function ScreenshotShowcase() {
  return (
    <section className="py-24 bg-midnight relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-ember/5 via-midnight to-midnight pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-paper mb-6">
            See It in Action
          </h2>
          <p className="text-lg text-slate">
            A clear view of your emissions, your impact, and your progress.
            Everything you need to make informed decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {screenshots.map((screenshot, i) => (
            <div
              key={screenshot.src}
              className={i === 1 ? 'md:-mt-4' : ''}
            >
              <DeviceFrame screenshot={screenshot} />
              <p className="mt-4 text-center text-sm text-slate/60 font-mono uppercase tracking-widest">
                {screenshot.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
