export const authorize = ({ scopes }, allowedScopeTypes, allowedScopeValues = [true]) =>
  scopes.some(
    ({ type, value }) =>
      allowedScopeTypes.includes(type) && allowedScopeValues.includes(value)
  )

export const MANAGE_SITE = 'MANAGE_SITE'
export const LIST_SITES = 'LIST_SITES'
export const CREATE_SITES = 'CREATE_SITES'
