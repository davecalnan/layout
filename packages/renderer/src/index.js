import React from 'react'
import ReactDOMServer from 'react-dom/server'
import classNames from 'classnames'
import hash from 'object-hash'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import perfectionist from 'perfectionist'
import { createTheming } from '@callstack/react-theme-provider'
import { toKebabCase } from '@layouthq/util'

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

/*
  Wrote this while a little bit drunk. God help us all.
*/
const styles = []

const createCSSRule = (name, statement) => `${name} {${statement}}`

export const styled = Component => {
  return (strings, ...expressions) => {
    return props => {
      const className = `${Component.name}--${hash(props)}`
      const rule = createCSSRule(
        `.${className}`,
        strings
          .map((string, index) => {
            const transformString = string => string
            const transformExpression = expression => {
              if (typeof expression === 'undefined') return ''
              if (typeof expression === 'function') {
                const result = expression(props)

                if (typeof result === 'object') {
                  const output = Object.entries(result)
                    .map(
                      ([key, value]) =>
                        `${toKebabCase(key)}: ${value};`
                    )
                    .join('')
                  return output
                }
                return result || ''
              }
              if (typeof expression === 'object') {
                const output =  Object.entries(expression)
                  .map(
                    ([key, value]) =>
                      `${toKebabCase(key)}: ${value};`
                  )
                  .join('')

                return output
              }

              return expression
            }

            return transformString(string) + transformExpression(expressions[index])
          })
          .join('')
      )
      if (!styles.includes(rule)) {
        styles.push(rule)
      }

      return Component({
        ...props,
        className: classNames(className, props.className)
      })
    }
  }
}

const processCSS = css => {
  console.log('input css:', css)
  return postcss([postcssNested, perfectionist({ indentSize: 2 })]).process(css).css
}

export const renderPage = (page, options) => {
  setBuildContext(options)

  const prettyCSS = processCSS(styles.join(''))
  styles.length && console.log(prettyCSS)

  const Tree = (
    <>
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

/*
  setBuildContext must be called before accessing this export in sections/components.
*/
export { buildContext }
