import _ from 'lodash'

export const stripKeysStartingWithUnderscore = object =>
  _.pickBy(object, (value, key) => !key.startsWith('_'))

export const stripInternalKeys = data =>
  _.isArray(data)
    ? data.map(item => {
        return _.isObject(item) && _.keys(item).length > 0
          ? stripKeysStartingWithUnderscore(item)
          : item
      })
    : stripKeysStartingWithUnderscore(data)
