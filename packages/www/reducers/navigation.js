export { UNDO as BACK, REDO as FORWARD } from '../hooks/use-undoable-reducer'

export const NAVIGATE = 'NAVIGATE'

export const navigationReducer = (path, { type, payload  }) => {
  switch (type) {
    case NAVIGATE:
      /*
        `payload` should be the new path to navigate to.
      */
      return payload

    default:
      throw new Error('Bad dispatch.')
  }
}
