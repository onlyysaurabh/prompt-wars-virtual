export const BADGES = {
  first_action: { name: 'First Step', description: 'Log your first carbon action', icon: '🌱' },
  streak_7: { name: 'Week Warrior', description: 'Log actions for 7 consecutive days', icon: '🔥' },
  streak_30: { name: 'Monthly Master', description: 'Log actions for 30 consecutive days', icon: '🏆' },
  below_average: { name: 'Below Average', description: 'Stay below your country\'s daily average', icon: '🌍' },
  transport_hero: { name: 'Transport Hero', description: 'Choose green transport 10 times', icon: '🚲' },
  energy_saver: { name: 'Energy Saver', description: 'Reduce energy use by 20%', icon: '⚡' },
  plant_power: { name: 'Plant Power', description: 'Log 20 plant-based meals', icon: '🥦' },
} as const

export type BadgeType = keyof typeof BADGES
