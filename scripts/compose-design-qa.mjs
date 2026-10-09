import sharp from '/Users/shaurya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs'

const width = 1672
const height = 941
const label = (text, x) => ({
  input: Buffer.from(`<svg width="${width}" height="52"><rect width="${width}" height="52" fill="#050608"/><text x="26" y="34" fill="#f5f0e8" font-family="Arial" font-size="20" letter-spacing="2">${text}</text></svg>`),
  left: x,
  top: 0,
})

const reference = await sharp('public/assets/reference/street-system-figma.png').resize(width, height).toBuffer()
const implementation = await sharp('qa/screenshots/street-implementation-desktop.png').resize(width, height).toBuffer()

await sharp({ create: { width: width * 2, height: height + 52, channels: 3, background: '#050608' } })
  .composite([
    label('FIGMA REFERENCE', 0),
    label('REAL-TIME 3D IMPLEMENTATION', width),
    { input: reference, left: 0, top: 52 },
    { input: implementation, left: width, top: 52 },
  ])
  .png()
  .toFile('qa/screenshots/street-design-qa-comparison.png')
