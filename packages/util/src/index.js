import _ from 'lodash'
import uuid from 'uuid/v4'

export const capitalise = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase()

export const generateComponentUUIDs = component => ({
  ...component,
  uuid: uuid()
})

export const generateFilePath = path => path.replace(/\/$/, '/index').concat('.html')

export const generateSectionUUIDs = section => ({
  ...section,
  uuid: uuid(),
  components: section.components ? section.components.map(generateComponentUUIDs) : undefined
})

export const isAbsoluteUrl = string => /^[a-z][a-z\d+.-]*:/.test(string)

export const isRelativeUrl = string => !isAbsoluteUrl(string)

export const moveDown = (array, index) => {
  if (index === array.length - 1) return array

  const copy = [...array]
  const deleted = copy.splice(index, 1)
  copy.splice(index + 1, null, ...deleted)

  return copy
}

export const moveUp = (array, index) => {
  if (index === 0) return array

  const copy = [...array]
  const deleted = copy.splice(index, 1)
  copy.splice(index - 1, null, ...deleted)

  return copy
}

export const reorder = (array, item, { destination, source }) => {
  if (!destination) return array

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return array
  }

  const updatedArray = [...array]
  updatedArray.splice(source.index, 1)
  updatedArray.splice(destination.index, 0, item)

  return updatedArray
}

export const splitIntoWords = (string) => {
  return string.replace(/([a-z])([A-Z])/g, (match, firstLetter, secondLetter) => `${ firstLetter } ${ secondLetter }`).toLowerCase().split(/ |_|-/)
}

export const toCamelCase = (string) => splitIntoWords(string).map((word, index) => index === 0 ? word : capitalise(word)).join('')

export const toCapitalCase = string => splitIntoWords(string).map(word => capitalise(word)).join(' ')

export const toConstantCase = (string) => splitIntoWords(string).map(word => word.toUpperCase()).join('_')

export const toKebabCase = (string) => splitIntoWords(string).join('-')

export const toLowerCase = (string) => splitIntoWords(string).map(word => word.toLowerCase()).join(' ')

export const toPascalCase = (string) => splitIntoWords(string).map(word => capitalise(word)).join('')

export const toSnakeCase = (string) => splitIntoWords(string).join('_')

export const toSentenceCase = (string) => splitIntoWords(string).map((word, index) => index === 0 ? capitalise(word) : word).join(' ')

export const toUpperCase = (string) => splitIntoWords(string).map(word => word.toUpperCase()).join(' ')

export const wait = async ms => new Promise(resolve => setTimeout(resolve, ms))

export const without = (object, ...matchingKeys) =>
  _.pickBy(object, (value, key) => !matchingKeys.includes(key))

export const withoutId = object => without(object, 'id')

export const withoutKeysStartingWithUnderscore = object =>
  _.pickBy(object, (value, key) => !key.startsWith('_'))

export const withoutInternalKeys = data => {
  if (_.isArray(data)) {
    return data.map(item =>
      _.isObject(item) && _.keys(item).length > 0
        ? without(withoutKeysStartingWithUnderscore(item), 'netlify', 'password')
        : item
    )
  }

  return without(withoutKeysStartingWithUnderscore(data), 'netlify', 'password')
}
