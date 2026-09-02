export const CTA_ROUTES = {
  audit: '/free-audit',
  project: '/start-project',
} as const

export type SceneId =
  | 'hero' | 'problems' | 'system' | 'services' | 'industries' | 'why-webnest'
  | 'work' | 'process' | 'pricing' | 'audit' | 'faq' | 'final-cta' | 'footer'

export type SceneDefinition = {
  id: SceneId
  eyebrow: string
  title: string
  description: string
  tone: string
}

export const SCENES: SceneDefinition[] = [
  { id: 'hero', eyebrow: 'WebNest Studio', title: 'Where brands become worlds.', description: 'We design connected digital systems that turn attention into lasting growth.', tone: 'ember' },
  { id: 'problems', eyebrow: 'The friction', title: 'Growth should not feel this fragmented.', description: 'Disconnected design, marketing and technology quietly drain momentum.', tone: 'crimson' },
  { id: 'system', eyebrow: 'One connected system', title: 'Strategy. Story. Systems. In one orbit.', description: 'A clear digital foundation where every touchpoint strengthens the next.', tone: 'violet' },
  { id: 'services', eyebrow: 'Services', title: 'Everything your brand needs to move forward.', description: 'Focused expertise, shaped around the stage you are in.', tone: 'bronze' },
  { id: 'industries', eyebrow: 'Business solutions', title: 'Built around how your world actually works.', description: 'Flexible systems for ambitious businesses, creators and modern service brands.', tone: 'rose' },
  { id: 'why-webnest', eyebrow: 'Why WebNest', title: 'Small team attention. Full-system thinking.', description: 'Senior craft, transparent decisions and a long-term view of your growth.', tone: 'cyan' },
  { id: 'work', eyebrow: 'Selected work', title: 'Proof lives in the details.', description: 'A selection of identities and digital experiences built to perform beautifully.', tone: 'moon' },
  { id: 'process', eyebrow: 'Our process', title: 'A calm path from idea to impact.', description: 'Clarity at every stage, with no black boxes and no unnecessary handoffs.', tone: 'sunset' },
  { id: 'pricing', eyebrow: 'Ways to work together', title: 'Choose the right level of momentum.', description: 'Clear starting points that flex to the needs of your business.', tone: 'forest' },
  { id: 'audit', eyebrow: 'Free growth audit', title: 'See what is holding your brand back.', description: 'Get a focused review of your website, positioning and digital growth opportunities.', tone: 'indigo' },
  { id: 'faq', eyebrow: 'Questions, answered', title: 'The things worth knowing before we begin.', description: 'Straight answers about scope, timing and working together.', tone: 'road' },
  { id: 'final-cta', eyebrow: 'Your next chapter', title: 'Ready to build a world people remember?', description: 'Bring us the ambition. We will help shape the system around it.', tone: 'ember' },
  { id: 'footer', eyebrow: 'WebNest', title: 'Built with care. Designed for momentum.', description: 'Strategy, identity and digital experiences for growing brands.', tone: 'ink' },
]

export const getSceneById = (id: SceneId) => SCENES.find((scene) => scene.id === id)

