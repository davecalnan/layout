import { buildComponentTree } from '@layouthq/renderer'

const Renderer = ({ site }) =>
  site.pages
    ? buildComponentTree(site.pages[0])
    : null

export default Renderer
