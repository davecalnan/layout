import classNames from 'classnames'
import createHash from 'object-hash'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import perfectionist from 'perfectionist'
import { toKebabCase, without } from '@layouthq/util'

import { styles } from './index'

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

export const styled = Component => {
  return (strings, ...expressions) => {
    return props => {
      const keysToHash = without(
        props,
        'children',
        'text',
        'markdown',
        'link'
      )
      const hash = createHash(keysToHash)
      const className = `${Component.name}--${hash}`
      const rule = createCSSRule(
        `.${className}`,
        strings
          .map((string, index) =>
            string + parseExpression(expressions[index], props)
          )
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

export const processCSS = css => {
  console.log('input css:', css)
  return postcss([
    postcssNested,
    perfectionist({ indentSize: 2 })
  ]).process(css).css
}
