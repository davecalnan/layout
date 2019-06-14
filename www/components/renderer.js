import { buildComponentTree } from '@layouthq/renderer'

const Renderer = ({ site }) =>
  site.components
    ? buildComponentTree(site, { browser: true })
    : null

export default Renderer
