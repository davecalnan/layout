import Frame from 'react-frame-component'
import { renderPageToReact } from '@layouthq/renderer'
import LoadingGrid from './loading-grid'

const Renderer = ({ site, currentPath }) => {
  const { pages, theme } = site
  if (!pages) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <LoadingGrid />
      </div>
    )
  }

  const currentPage = pages.find(({ path }) => path === currentPath)

  return (
    <Frame className="flex-1">
      {renderPageToReact(currentPage, { theme })}
    </Frame>
  )
}

export default Renderer
