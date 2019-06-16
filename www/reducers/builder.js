import Router from 'next/router'

export const ERROR = 'ERROR'
export const START_LOADING_SITE = 'START_LOADING_SITE'
export const FINISH_LOADING_SITE = 'FINISH_LOADING_SITE'
export const EDIT_SITE = 'EDIT_SITE'
export const START_CREATING = 'START_CREATING'
export const FINISH_CREATING = 'FINISH_CREATING'
export const START_SAVING = 'START_SAVING'
export const FINISH_SAVING = 'FINISH_SAVING'
export const START_DEPLOYING = 'START_DEPLOYING'
export const FINISH_DEPLOYING = 'FINISH_DEPLOYING'

export const builderReducer = (state, { type, payload }) => {
  switch (type) {
    case ERROR:
      return {
        ...state,
        hasError: payload.error,
        isDeploying: payload.isDeploying || state.isDeploying,
        isSaving: payload.isSaving || state.isSaving,
        message: 'Something went wrong'
      }
    case START_LOADING_SITE:
      return {
        ...state,
        isLoading: true
      }
    case FINISH_LOADING_SITE:
      return {
        ...state,
        isLoading: false
      }
    case EDIT_SITE: {
      return {
        ...state,
        hasUnsavedEdits: true
      }
    }
    case START_CREATING:
      return {
        ...state,
        hasError: false,
        isSaving: true,
        message: 'Saving...'
      }
    case FINISH_CREATING:
      const href = `/builder?siteId=${payload.id}`
      const as = `/sites/${payload.id}/builder`
      Router.push(href, as, {
        shallow: true
      })
      return {
        ...state,
        hasUnsavedEdits: false,
        isExistingSite: true,
        isSaving: false,
        message: null
      }
    case START_SAVING:
      return {
        ...state,
        error: false,
        isSaving: true,
        message: 'Saving...'
      }
    case FINISH_SAVING:
      return {
        ...state,
        hasUnsavedEdits: false,
        isSaving: false,
        message: null
      }
    case START_DEPLOYING:
      return {
        ...state,
        hasError: false,
        isDeploying: true,
        message: 'Deploying...'
      }
    case FINISH_DEPLOYING:
      return {
        ...state,
        isDeploying: false,
        message: null
      }
    default:
      throw new Error('Bad dispatch.')
  }
}
