import type { SiteTheme } from './SiteTheme'

export const SCENE_PLATES = {
  heroRoom: {
    morning: '/assets/optimized/frame1.jpg',
    night: '/assets/optimized/hero-room-clean.jpg',
  },
  building: {
    morning: '/assets/optimized/frame2.jpg',
    night: '/assets/optimized/building-night.jpg',
  },
  cherryGarden: {
    morning: '/assets/optimized/frame5.jpg',
    night: '/assets/reference/cherry-garden-royal.webp',
  },
  apartment: {
    morning: '/assets/optimized/frame6.jpg',
    night: '/assets/reference/apartment-facade-royal.webp',
  },
  selectedWork: {
    morning: '/assets/optimized/frame7.jpg',
    night: '/assets/cinematic/selected-work-bg.jpg',
  },
  process: {
    morning: '/assets/optimized/frame8.jpg',
    night: '/assets/cinematic/process-bg.jpg',
  },
  pricing: {
    morning: '/assets/optimized/frame9.jpg',
    night: '/assets/cinematic/pricing-bg.jpg',
  },
  audit: {
    morning: '/assets/optimized/frame10.jpg',
    night: '/assets/cinematic/audit-bg.jpg',
  },
  faq: {
    morning: '/assets/optimized/frame11.jpg',
    night: '/assets/cinematic/faq-bg.jpg',
  },
  finalRoom: {
    morning: '/assets/optimized/frame1.jpg',
    night: '/assets/cinematic/final-bg.jpg',
  },
} as const satisfies Record<string, Record<SiteTheme, string>>

export type ScenePlateId = keyof typeof SCENE_PLATES

export function getScenePlate(id: ScenePlateId, theme: SiteTheme) {
  return SCENE_PLATES[id][theme]
}
