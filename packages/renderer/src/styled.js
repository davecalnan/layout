import classNames from 'classnames'
import createHash from 'object-hash'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import perfectionist from 'perfectionist'
import { toKebabCase } from '@layouthq/util'

import { styles } from './index'

export const processedComponents = []

export const generateClassName = (Component, variant) =>
  variant ? `${Component.name}--${variant.name}__${variant.value}` : Component.name

const createCSSRule = (name, statement) => `${name} {${statement}}`

const parseExpression = (expression, props) => {
  if (typeof expression === 'string') return expression
  if (typeof expression === 'undefined') return ''

  const parseObjectExpression = expression =>
    Object.entries(expression)
      .map(([key, value]) => {
        if (key.startsWith('@')) {
          return createCSSRule(key, parseObjectExpression(value))
        }
        return `${toKebabCase(key)}: ${value};\n`
      })
      .join('')

  let result

  if (typeof expression === 'function') {
    result = expression(props)
  }

  if (typeof expression === 'object') {
    result =  parseObjectExpression(expression)
  }

  return parseExpression(result)
}

const interpolateCSSinJS = ([strings, ...expressions], props) =>
  strings
    .map((string, index) => string + parseExpression(expressions[index], props))
    .join('')

const addStyle = (inputCSS, Component, props, variant) => {
  const variantProps = {
    theme: props.theme
  }

  if (variant) {
    variantProps[variant.name] = variant.value
  }

  const rule = createCSSRule(
    `.${generateClassName(Component, variant)}`,
    interpolateCSSinJS(inputCSS, variantProps)
  )

  if (!styles.includes(rule)) {
    styles.push(rule)
  }
}

export const styled = Component => {
  return (...inputCSS) => {
    return props => {
      const processComponent = (Component, props, listPropTypes) => {
        console.log('processing:', Component.name)

        if (listPropTypes.length > 0) {
          listPropTypes.forEach(([propName, propType]) => {
            propType.options.forEach(option => {
              addStyle(inputCSS, Component, props, {
                name: propName,
                value: option
              })
            })
          })
        } else {
          addStyle(inputCSS, Component, props)
        }

        processedComponents.push(Component)
      }

      const className = Component.name

      const listPropTypes = Object
        .entries(Component.propTypes || {})
        .filter(([propName, propType]) => propType.type === 'list')

      const variantClassNames = listPropTypes.map(
        ([propName, propType]) =>
          generateClassName(Component, {
            name: propName,
            value: props[propName]
          })
      )

      if (!processedComponents.includes(Component)) {
        processComponent(Component, props, listPropTypes)
      }

      return Component({
        ...props,
        className: classNames(className, variantClassNames, props.className)
      })
    }
  }
}

export const processCSS = css => {
  return postcss([
    postcssNested,
    perfectionist({ indentSize: 2 })
  ]).process(css).css
}
