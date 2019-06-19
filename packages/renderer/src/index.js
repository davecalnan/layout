import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createTheming } from '@callstack/react-theme-provider'
import { processCSS } from './styled'

const ButtonWrapper = ({ children }) => {
  return <div className="flex flex-wrap">{children}</div>
}

const Stack = ({ children }) =>
  children.reduce((accumulator, component, index, components) => {
    const previousComponent = accumulator[accumulator.length - 1]
    const nextComponent = components[index + 1]

    const componentWithKey = {
      ...component,
      props: {
        ...component.props,
        key: index
      }
    }

    /*
      Wrap sibling buttons in a container.
    */
    if (component.type.name === 'Button') {
      if (previousComponent && previousComponent.type.name === 'ButtonWrapper') {
        previousComponent.props.children.push(componentWithKey)
        return accumulator
      }

      if (nextComponent && nextComponent.type.name === 'Button') {
        return [
          ...accumulator,
          <ButtonWrapper key={index}>{[component]}</ButtonWrapper>
        ]
      }
    }

    return [...accumulator, componentWithKey]
  }, [])

let buildContext = {}

const setBuildContext = options => {
  const { theme } = options

  const objectToMergeWithContext = {
    ...createTheming(theme)
  }

  Object
    .entries(objectToMergeWithContext)
    .forEach(([key, value]) => buildContext[key] = value)
}

export const styles = []

export const renderPage = (page, options) => {
  setBuildContext(options)

  const prettyCSS = processCSS(styles.join(''))

  const Tree = (
    <>
      <link href="https://fonts.googleapis.com/css?family=Special+Elite&display=swap" rel="stylesheet" />
      <style>{prettyCSS}</style>
      {buildComponentTree(page, options)}
    </>
  )

  return Tree
}

export const buildComponentTree = (page, options = {}) => {

  return page.sections.map(({ id, components = [], props }, index) => {
    const { default: Section } = require(`@layouthq/sections/dist/${id}`)

    const children = components.map(({ id, props }) => {
      const { default: Component } = require(`@layouthq/components/dist/${id}`)

      return <Component {...props} />
    })

    return (
      <Section key={index} {...props}>
        <Stack>{children}</Stack>
      </Section>
    )
  })
}

export const generateHTML = (page, options) =>
  [
    '<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body>',
    ReactDOMServer.renderToStaticMarkup(
      buildComponentTree(page, options)
    ),
    '</body></html>'
  ].join('')

export { styled } from './styled'

/*
  setBuildContext must be called before accessing this export in sections/components.
*/
export { buildContext }
