import { useEffect, useRef } from 'react'
import Frame from 'react-frame-component'
import { renderPageToReact } from '@layouthq/renderer'
import parseUrl from 'url-parse'

const hijackClicks = (frame, site, onNavigate) => {
  const document = frame.node.contentDocument
  const html = document.children[0]

  const treeWalker = document.createTreeWalker(
    html,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: node =>
        node.tagName === 'A' || node.type === 'submit'
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP
    }
  )

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode

    if (node.tagName === 'A') {
      const link = treeWalker.currentNode
      const { host, pathname } = parseUrl(link.href)

      const isInternalLink = host === document.location.host

      if (isInternalLink) {
        link.href = site.url + pathname
        link.onclick = event => {
          event.preventDefault()
          if (site.pages.find(({ path }) => path === pathname)) {
            return onNavigate(pathname)
          }

          alert(
            'That link goes to a page which does not exist on your site. Check the spelling and make sure the link is correct.'
          )
        }
      } else {
        link.target = '_blank'
        link.rel = 'noreferrer noopener'
        link.onclick = undefined
      }
    }

    if (node.type === 'submit') {
      node.onclick = event => {
        event.preventDefault()
        alert('Form submissions are disabled in this preview. View your live site if you would like to submit a form.')
      }
    }
  }
}

const Previewer = ({ site, currentPath, onNavigate }) => {
  const { pages, theme } = site

  const frame = useRef(null)

  useEffect(() => {
    hijackClicks(frame.current, site, onNavigate)
  })

  const currentPage = pages.find(({ path }) => path === currentPath)

  return (
    <Frame className="flex-1" ref={frame}>
      {renderPageToReact(currentPage, { theme })}
    </Frame>
  )
}

export default Previewer
