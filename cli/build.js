import fs from 'fs'
import { promisify } from 'util'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import site from '../demo/site.json'

const writeFile = promisify(fs.writeFile)

const build = () => [
  '<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body>',
  ReactDOMServer.renderToStaticMarkup(
    site.components.map((({ name, props }, index) => {
      const Component = require(`../demo/${ name }.demo`).default
      return React.createElement(
        Component,
        {
          ...props,
          key: index
        },
        null
      )
    }))
  ),
  '</body></html>'
].join('')

const save = async (html, outputLocation) => {
  await writeFile(outputLocation, html)
}

const main = async () => {
  const outputDirectory = 'site'
  const outputFilename = 'index.html'
  const outputPath = `${outputDirectory}/${outputFilename}`

  const html = build()

  await save(html, outputPath)
  console.log(`File successfully written to ${outputPath}.`)
}

main()
