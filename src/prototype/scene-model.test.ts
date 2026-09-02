import { describe, expect, it } from 'vitest'
import { CTA_ROUTES, SCENES, getSceneById } from './scene-model'

describe('homepage scene contract', () => {
  it('keeps the approved connected scene order', () => {
    expect(SCENES.map((scene) => scene.id)).toEqual([
      'hero', 'problems', 'system', 'services', 'industries', 'why-webnest',
      'work', 'process', 'pricing', 'audit', 'faq', 'final-cta', 'footer',
    ])
  })

  it('uses canonical conversion routes', () => {
    expect(CTA_ROUTES).toEqual({ audit: '/free-audit', project: '/start-project' })
    expect(getSceneById('work')?.eyebrow).toBe('Selected work')
  })
})

