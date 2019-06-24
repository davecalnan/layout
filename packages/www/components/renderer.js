import Frame from 'react-frame-component'
import { renderPageToReact } from '@layouthq/renderer'
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
      className="flex-1"
    >
      {renderPageToReact(pages[0], { theme })}
    </Frame>
  )
}

export default Renderer
