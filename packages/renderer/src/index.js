import React from 'react'
import ReactDOMServer from 'react-dom/server'

export const buildComponentTree = (page, options = {}) =>
  page.sections.map(({ id, props }, index) => {
    const Component = require(`@layouthq/sections/dist/${id}`).default

    return <Component key={index} {...props} />
  })

export const generateHTML = page =>
  [
    '<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body>',
    ReactDOMServer.renderToStaticMarkup(
      buildComponentTree(page)
    ),
    '</body></html>'
  ].join('')