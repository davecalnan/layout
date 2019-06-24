import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { addComponentStyles, processCSS } from './styled'

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

const styles = []

const buildComponentTree = (page, options = {}) =>
  page.sections.map(({ id, components = [], props }, index) => {
    const { default: Section } = require(`@layouthq/sections/dist/${id}`)
    if (Section.isStyledComponent) {
      addComponentStyles(styles, Section, options)
    }

    const children = components.map(({ id, props }) => {
      const { default: Component } = require(`@layouthq/components/dist/${id}`)

      if (Component.isStyledComponent) {
        addComponentStyles(styles, Component, options)
      }
      return <Component {...props} />
    })

    return (
      <Section key={index} {...props}>
        <Stack>{children}</Stack>
      </Section>
    )
  })

export const renderPageToReact = (page, options) => {
  const componentTree = buildComponentTree(page, options)
  const prettyCSS = processCSS(styles.join(''))

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Special+Elite&display=swap"
        rel="stylesheet"
      />
      <style>{prettyCSS}</style>
      {componentTree}
    </>
  )
}

export const renderPageToHTML = (page, options) => {
  const componentTree = buildComponentTree(page, options)
  const prettyCSS = processCSS(styles.join(''))

  const html = ReactDOMServer.renderToStaticMarkup(
    <html>
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="https://fonts.googleapis.com/css?family=Special+Elite&display=swap" rel="stylesheet" />
      </head>
      <body>
        <style dangerouslySetInnerHTML={{ __html: prettyCSS }} />
        {componentTree}
      </body>
    </html>
  )

  return '<!doctype html>' + html
}

export { styled } from './styled'
