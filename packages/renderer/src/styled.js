import classNames from 'classnames'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import perfectionist from 'perfectionist'
import { toKebabCase } from '@layouthq/util'

const baseCSS =
  '/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}html{box-sizing:border-box;font-family:sans-serif}*,::after,::before{box-sizing:inherit}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,p,pre{margin:0}button{background:0 0;padding:0}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}fieldset{margin:0;padding:0}ol,ul{list-style:none;margin:0;padding:0}html{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}*,::after,::before{border-width:0;border-style:solid;border-color:#e2e8f0}img{border-style:solid}textarea{resize:vertical}input:-ms-input-placeholder,textarea:-ms-input-placeholder{color:inherit;opacity:.5}input::-ms-input-placeholder,textarea::-ms-input-placeholder{color:inherit;opacity:.5}input::placeholder,textarea::placeholder{color:inherit;opacity:.5}[role=button],button{cursor:pointer}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,optgroup,select,textarea{padding:0;line-height:inherit;color:inherit}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}'

const processedComponents = []

const generateClassName = (Component, variant) =>
  variant ? `${Component.name}__${variant.name}--${variant.value}` : Component.name

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
    try {
      result = expression(props)
    } catch (error) {}
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


const generateRule = (inputCSS, Component, { theme }, variant) => {
  const variantProps = {
    theme
  }

  if (variant) {
    variantProps[variant.name] = variant.value
  }

  return createCSSRule(
    `.${generateClassName(Component, variant)}`,
    interpolateCSSinJS(inputCSS, variantProps)
  )
}

const extractBooleanPropTypes = Component => Object.entries(Component.propTypes || {}).filter(
  ([propName, propType]) => propType.type === 'boolean'
)

const extractEnumPropTypes = Component => Object.entries(Component.propTypes || {}).filter(
  ([propName, propType]) => propType.type === 'enum'
)

export const addComponentStyles = (styles, Component, options) => {
  const processComponent = (Component, options) => {
    const booleanPropTypes = extractBooleanPropTypes(Component)
    const enumPropTypes = extractEnumPropTypes(Component)

    const rule = generateRule(Component.inputCSS, Component, options)

    if (!styles.includes(rule)) {
      styles.push(rule)
    }

    booleanPropTypes.forEach(([propName, propType]) => {
      [true, false].forEach(option => {
        const rule = generateRule(Component.inputCSS, Component, options, {
          name: propName,
          value: option
        })

        if (!styles.includes(rule)) {
          styles.push(rule)
        }
      })
    })

    enumPropTypes.forEach(([propName, propType]) => {
      propType.options.forEach(option => {
        const rule = generateRule(Component.inputCSS, Component, options, {
          name: propName,
          value: option
        })

        if (!styles.includes(rule)) {
          styles.push(rule)
        }
      })
    })

    processedComponents.push(Component)
  }

  if (!processedComponents.includes(Component)) {
    processComponent(Component, options)
  }
}

export const styled = Component => {
  return (...inputCSS) => {
    const annoyingObjectSoThatICanNameTheFunctionDynamically = {
      [Component.name]: props => {
        const variantClassNames =
          [...extractBooleanPropTypes(Component), ...extractEnumPropTypes(Component)].map(([propName, propType]) => {
            return generateClassName(Component, {
              name: propName,
              value: props[propName]
            })
          }
          )

        return Component({
          ...props,
          className: classNames(
            Component.name,
            variantClassNames,
            props.className
          )
        })
      }
    }

    const Output = annoyingObjectSoThatICanNameTheFunctionDynamically[Component.name]
    Output.propTypes = Component.propTypes
    Output.inputCSS = inputCSS
    Output.isStyledComponent = true

    return Output
  }
}

const removeBaseDeclarationsFromVariants = postcss.plugin(
  'remove-base-declarations-from-variants',
  (options = {}) =>
    root => {
      root.walkRules(rule => {
        const getBaseSelector = selector => {
          const variantSelector =
            (selector.match(/(.[^ ]*)( )/, (match, target) => target) || [])[1] || selector
          const [_, baseSelector] = selector.match(
            /(.[a-zA-Z]*)(__)/,
            (match, target) => target
          ) || []

          return selector.replace(variantSelector, baseSelector)
        }
        const baseRule = root.nodes
          .filter(node => node.type === 'rule')
          .find(
            searchRule =>
              searchRule !== rule &&
              searchRule.selector === getBaseSelector(rule.selector)
          )

        if (baseRule) {
          rule.walkDecls(decl => {
            const declarationExistsOnBaseRule = baseRule.nodes.some(
              searchDeclaration =>
                searchDeclaration.prop === decl.prop &&
                searchDeclaration.value === decl.value
            )
            if (declarationExistsOnBaseRule) {
              decl.remove()
            }
          })
        }
      })
    }
)

const removeDeclarationsWithoutValues = postcss.plugin(
  'remove-declarations-without-values',
  (options = {}) => root => {
    root.walkDecls(decl => {
      if (decl.value === '') {
        decl.remove()
      }
    })
  }
)

const removeEmptyRules = postcss.plugin(
  'remove-empty-rules',
  (options = {}) => root => {
    root.walkRules(rule => {
      if (rule.nodes.length === 0) {
        rule.remove()
      }
    })
  }
)

export const processCSS = css =>
  postcss([
    postcssNested,
    removeBaseDeclarationsFromVariants,
    removeDeclarationsWithoutValues,
    removeEmptyRules,
    perfectionist({ indentSize: 2 }),
  ]).process(baseCSS + css).css
