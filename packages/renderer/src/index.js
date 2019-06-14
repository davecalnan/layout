import React from 'react'
import ReactDOMServer from 'react-dom/server'

export const buildComponentTree = (site, options) =>
  site.components.map(({ id, props }, index) => {
    const Component = options.server
      ? require(`@layouthq/sections/dist/${id}`).default
      : React.lazy(() => import(`@layouthq/sections/dist/${id}`))

      return <Component key={index} {...props} />
    })

export const generateHTML = site =>
  [
    '<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body>',
    ReactDOMServer.renderToStaticMarkup(
      buildComponentTree(site, { server: true })
    ),
    '</body></html>'
  ].join('')