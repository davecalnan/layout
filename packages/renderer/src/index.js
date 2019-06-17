import React from 'react'
import ReactDOMServer from 'react-dom/server'

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

export const buildComponentTree = (page, options = {}) =>
  page.sections.map(({ id, components = [], props }, index) => {
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

export const generateHTML = page =>
  [
    '<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body>',
    ReactDOMServer.renderToStaticMarkup(
      buildComponentTree(page)
    ),
    '</body></html>'
  ].join('')