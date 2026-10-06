import type { SiteTheme } from './SiteTheme'

export const SCENE_PLATES = {
  heroRoom: {
    morning: '/assets/generated/hero-room-morning.png',
    night: '/assets/generated/hero-room-clean.png',
  },
  building: {
    morning: '/assets/generated/building-morning.webp',
    night: '/assets/generated/building-night.png',
  },
  cherryGarden: {
    morning: '/assets/reference/cherry-garden-morning.webp',
    night: '/assets/reference/cherry-garden-royal.webp',
  },
  apartment: {
    morning: '/assets/reference/apartment-facade-morning.webp',
    night: '/assets/reference/apartment-facade-royal.webp',
  },
  selectedWork: {
    morning: '/assets/cinematic/selected-work-morning.webp',
    night: '/assets/cinematic/selected-work-bg.jpg',
  },
  process: {
    morning: '/assets/cinematic/process-morning.webp',
    night: '/assets/cinematic/process-bg.jpg',
  },
  pricing: {
    morning: '/assets/cinematic/pricing-morning.webp',
    night: '/assets/cinematic/pricing-bg.jpg',
  },
  audit: {
    morning: '/assets/cinematic/audit-morning.webp',
    night: '/assets/cinematic/audit-bg.jpg',
  },
  faq: {
    morning: '/assets/cinematic/faq-morning.webp',
    night: '/assets/cinematic/faq-bg.jpg',
  },
  finalRoom: {
    morning: '/assets/cinematic/final-morning.webp',
    night: '/assets/cinematic/final-bg.jpg',
  },
} as const satisfies Record<string, Record<SiteTheme, string>>

export type ScenePlateId = keyof typeof SCENE_PLATES

export function getScenePlate(id: ScenePlateId, theme: SiteTheme) {
  return SCENE_PLATES[id][theme]
}
