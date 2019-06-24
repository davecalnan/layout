import { toCapitalCase } from '@layouthq/util'
import { MOVE_COMPONENT_DOWN, MOVE_COMPONENT_UP, REMOVE_COMPONENT_FROM_SECTION } from '../reducers/site'
import BasePreviewCard from './base-preview-card'

const ComponentPreviewCard = ({ currentPage, currentSection, component, onClick, onEdit, canMoveUp, canMoveDown }) => (
  <BasePreviewCard
    name={toCapitalCase(component.name)}
    onClick={onClick}
    onMoveUp={() => {
      if (canMoveUp) {
        onEdit({
          type: MOVE_COMPONENT_UP,
          target: {
            page: currentPage,
            section: currentSection,
            component
          }
        })
      }
    }}
    onMoveDown={() => {
      if (canMoveDown) {
        onEdit({
          type: MOVE_COMPONENT_DOWN,
          target: {
            page: currentPage,
            section: currentSection,
            component
          }
        })
      }
    }}
    onDelete={() => {
      onEdit({
        type: REMOVE_COMPONENT_FROM_SECTION,
        target: {
          page: currentPage,
          section: currentSection,
          component
        }
      })
    }}
  />
)

export default ComponentPreviewCard
