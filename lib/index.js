export const PropTypes = {
  string: function string(props, propName, componentName) {
    if (!typeof props[propName] === 'string') {
      return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`)
    }
  },
  text: function text(props, propName, componentName) {
    if (!typeof props[propName] === 'string') {
      return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`)
    }
  },
  list: function list(array) {
    const fn = function list(props, propName, componentName) {
      if (!array.includes(props[propName])) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`)
      }
    }
    fn.options = array
    return fn
  }
}
