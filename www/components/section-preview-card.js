import { MOVE_SECTION_DOWN, MOVE_SECTION_UP, REMOVE_SECTION_FROM_PAGE } from '../reducers/site'
import BasePreviewCard from './base-preview-card'

const SectionPreviewCard = ({ currentPage, section, onClick, onEdit, canMoveUp, canMoveDown }) => (
  <BasePreviewCard
    name={section.name}
    onClick={onClick}
    onMoveUp={() => {
      if (canMoveUp) {
        onEdit({
          type: MOVE_SECTION_UP,
          target: {
            page: currentPage,
            section
          }
        })
      }
    }}
    onMoveDown={() => {
      if (canMoveDown) {
        onEdit({
          type: MOVE_SECTION_DOWN,
          target: {
            page: currentPage,
            section
          }
        })
      }
    }}
    onDelete={() => {
      onEdit({
        type: REMOVE_SECTION_FROM_PAGE,
        target: {
          page: currentPage,
          section
        }
      })
    }}
  />
)

export default SectionPreviewCard
