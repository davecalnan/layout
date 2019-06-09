import _ from 'lodash'

export const without = (object, matchingKey) =>
  _.pickBy(object, (value, key) => key !== matchingKey)

export const withoutId = object => without(object, 'id')

export const withoutKeysStartingWithUnderscore = object =>
  _.pickBy(object, (value, key) => !key.startsWith('_'))

export const withoutInternalKeys = data =>
  _.isArray(data)
    ? data.map(item => {
        return _.isObject(item) && _.keys(item).length > 0
          ? withoutKeysStartingWithUnderscore(item)
          : item
      })
    : withoutKeysStartingWithUnderscore(data)
