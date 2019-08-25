const array = (props, propName, componentName) => {
  if (Array.isArray(props[propName])) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
    )
  }
}
array.type = 'array'

const boolean = (props, propName, componentName) => {
  if (!typeof props[propName] === 'boolean') {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
    )
  }
}
boolean.type = 'boolean'

const oneOf = array => {
  const fn = (props, propName, componentName) => {
    if (!array.includes(props[propName])) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
      )
    }
  }
  fn.type = 'enum'
  fn.options = array
  return fn
}

const string = (props, propName, componentName) => {
  if (!typeof props[propName] === 'string') {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
    )
  }
}
string.type = 'string'

const text = (props, propName, componentName) => {
  if (!typeof props[propName] === 'string') {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`
    )
  }
}
text.type = 'text'

const typography = {
  backgroundType: oneOf(['light', 'dark'])
}

const form = {
  name: string,
  action: string
}

const PropTypes = {
  array,
  boolean,
  form,
  oneOf,
  string,
  text,
  typography
}

export default PropTypes
