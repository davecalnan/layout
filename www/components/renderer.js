import Frame from 'react-frame-component'
import { buildComponentTree } from '@layouthq/renderer'
import LoadingGrid from './loading-grid'

const Renderer = ({ site }) => {
  if (!site.pages) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <LoadingGrid />
      </div>
    )
  }

  return (
    <Frame
      initialContent='<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body><div></div></body></html>'
      className="flex-1"
    >
      {buildComponentTree(site.pages[0])}
    </Frame>
  )
}

export default Renderer
