const string = (props, propName, componentName) => {
  if (!typeof props[propName] === 'string') {
    return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`)
  }
}
string.type = 'string'

const text = (props, propName, componentName) => {
  if (!typeof props[propName] === 'string') {
    return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`)
  }
}
text.type = 'text'

const list = (array) => {
  const fn = (props, propName, componentName) => {
    if (!array.includes(props[propName])) {
      return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`)
    }
  }
  fn.type = 'list'
  fn.options = array
  return fn
}

export const PropTypes = {
  string,
  text,
  list
}
