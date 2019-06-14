import { buildComponentTree } from '@layouthq/renderer'

const Renderer = ({ site }) =>
  site.pages
    ? buildComponentTree(site.pages[0], { browser: true })
    : null

export default Renderer
