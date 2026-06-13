// kg CO₂ per day per capita (2024 estimates)
export const COUNTRY_AVERAGES = {
  US: 42.0, CA: 35.0, AU: 40.0, UK: 28.0, DE: 25.0,
  FR: 22.0, JP: 30.0, CN: 22.0, IN: 7.0, BR: 12.0,
  GLOBAL: 16.0,
} as const

export type CountryCode = keyof typeof COUNTRY_AVERAGES
