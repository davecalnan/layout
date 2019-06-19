import Frame from 'react-frame-component'
import { renderPage } from '@layouthq/renderer'
import LoadingGrid from './loading-grid'

const Renderer = ({ site }) => {
  const { pages, theme } = site
  if (!pages) {
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
      {renderPage(pages[0], { theme })}
    </Frame>
  )
}

export default Renderer
