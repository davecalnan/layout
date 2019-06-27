import { useEffect, useRef } from 'react'
import Frame from 'react-frame-component'
import { renderPageToReact } from '@layouthq/renderer'
import parseUrl from 'url-parse'
import LoadingGrid from './loading-grid'

const replaceLinks = (frame, site, onNavigate) => {
  const document = frame.node.contentDocument
  const html = document.children[0]

  const treeWalker = document.createTreeWalker(
    html,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: node =>
        node.tagName === 'A'
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP
    }
  )

  while (treeWalker.nextNode()) {
    const link = treeWalker.currentNode
    const { pathname } = parseUrl(link.href)
    link.href = site.url + pathname
    link.onclick = event => {
      event.preventDefault()
      onNavigate(pathname)
    }
  }
}

const Previewer = ({ site, currentPath, onNavigate }) => {
  const { pages, theme } = site
  if (!pages) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <LoadingGrid />
      </div>
    )
  }

  const frame = useRef(null)

  useEffect(() => {
    replaceLinks(frame.current, site, onNavigate)
  })

  const currentPage = pages.find(({ path }) => path === currentPath)

  return (
    <Frame className="flex-1" ref={frame}>
      {renderPageToReact(currentPage, { theme })}
    </Frame>
  )
}

export default Previewer
