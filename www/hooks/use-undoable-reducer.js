import { useReducer } from 'react'

export const RESET = 'RESET'
export const REDO = 'REDO'
export const UNDO = 'UNDO'

export const useUndoableReducer = (reducer, initialPresent) => {
  const initialState = {
    history: [initialPresent],
    currentIndex: 0
  }

  const [state, dispatch] = useReducer(undoable(reducer), initialState)

  const { history, currentIndex } = state

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return { state: history[currentIndex], dispatch, history, canUndo, canRedo }
}

const undoable = reducer =>
  // Return a reducer that handles undo and redo
  (state, action) => {
    const { history, currentIndex } = state

    switch (action.type) {
      case RESET:
        return {
          ...state,
          history: [action.payload],
          currentIndex: 0
        }
      case UNDO:
        return {
          ...state,
          currentIndex: currentIndex - 1
        }
      case REDO:
        return {
          ...state,
          currentIndex: currentIndex + 1
        }
      default:
        // Delegate handling the action to the passed reducer
        const present = history[currentIndex]
        const newPresent = reducer(present, action)

        if (present === newPresent) {
          // Nothing's changed, don't update history
          return state
        }

        const newIndex = currentIndex + 1
        const newHistory = history.slice(0, newIndex)

        return {
          history: [...newHistory, newPresent],
          currentIndex: newIndex
        }
    }
  }
