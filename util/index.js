import _ from 'lodash'

export const capitalise = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase()

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

export const stripKeysStartingWithUnderscore = object => _.pickBy(object, (value, key) => !key.startsWith('_'))

export const stripInternalKeys = data =>
  _.isArray(data)
  ? data.map(item => {
      return (_.isObject(item) && _.keys(item).length > 0)
        ? stripKeysStartingWithUnderscore(item)
        : item
    })
  : stripKeysStartingWithUnderscore(data)
