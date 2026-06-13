import { BADGES, BadgeType } from '@/lib/carbon/badges'

interface BadgeCollectionProps {
  earnedBadges: BadgeType[]
}

export function BadgeCollection({ earnedBadges }: BadgeCollectionProps) {
  const allBadges = Object.entries(BADGES)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {allBadges.map(([id, badge]) => {
        const isEarned = earnedBadges.includes(id as BadgeType)
        return (
          <div
            key={id}
            className={`flex flex-col items-center p-4 rounded-lg border text-center transition-all ${
              isEarned
                ? 'bg-canvas border-primary/20 shadow-sm'
                : 'bg-canvas-soft border-hairline opacity-50 grayscale'
            }`}
          >
            <span className="text-4xl mb-2" aria-hidden="true">{badge.icon}</span>
            <h3 className="text-sm font-semibold text-ink mb-1">{badge.name}</h3>
            <p className="text-xs text-ink-secondary">{badge.description}</p>
            {isEarned && (
              <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                Earned
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
