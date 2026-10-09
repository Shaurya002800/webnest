import type { SiteTheme } from './SiteTheme'

export const SCENE_PLATES = {
  heroRoom: {
    morning: '/assets/morning/frame1.png',
    night: '/assets/generated/hero-room-clean.png',
  },
  building: {
    morning: '/assets/morning/frame2.png',
    night: '/assets/generated/building-night.png',
  },
  cherryGarden: {
    morning: '/assets/morning/frame5.png',
    night: '/assets/reference/cherry-garden-royal.webp',
  },
  apartment: {
    morning: '/assets/morning/frame6.png',
    night: '/assets/reference/apartment-facade-royal.webp',
  },
  selectedWork: {
    morning: '/assets/morning/frame7.png',
    night: '/assets/cinematic/selected-work-bg.jpg',
  },
  process: {
    morning: '/assets/morning/frame8.png',
    night: '/assets/cinematic/process-bg.jpg',
  },
  pricing: {
    morning: '/assets/morning/frame9.png',
    night: '/assets/cinematic/pricing-bg.jpg',
  },
  audit: {
    morning: '/assets/morning/frame10.png',
    night: '/assets/cinematic/audit-bg.jpg',
  },
  faq: {
    morning: '/assets/morning/frame11.png',
    night: '/assets/cinematic/faq-bg.jpg',
  },
  finalRoom: {
    morning: '/assets/morning/frame1.png',
    night: '/assets/cinematic/final-bg.jpg',
  },
} as const satisfies Record<string, Record<SiteTheme, string>>

export type ScenePlateId = keyof typeof SCENE_PLATES

export function getScenePlate(id: ScenePlateId, theme: SiteTheme) {
  return SCENE_PLATES[id][theme]
}
