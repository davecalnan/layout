import { toSentenceCase } from '@layouthq/util'
import { MOVE_SECTION_DOWN, MOVE_SECTION_UP, REMOVE_SECTION_FROM_PAGE } from '../reducers/site'
import { P, Small } from './typography'
import Button from './button'

const SectionPreviewCard = ({ currentPage, section, onClick, onEdit }) => {
  return (
    <button
      className="w-full h-20 flex justify-between items-center text-left bg-white rounded shadow px-4 mb-2"
      onClick={onClick}
    >
      <div className="mr-4">
        <P>{toSentenceCase(section.name)}</P>
        {section.props.heading && (
          <Small>{section.props.heading}</Small>
        )}
      </div>
      <div className="flex-shrink-0">
        <Button
          className="mr-1"
          onClick={event => {
            event.stopPropagation()
            onEdit({
              type: MOVE_SECTION_UP,
              target: {
                page: currentPage,
                section
              }
            })
          }}
          compact
        >
          &uarr;
        </Button>
        <Button
          className="mr-1"
          onClick={event => {
            event.stopPropagation()
            onEdit({
              type: MOVE_SECTION_DOWN,
              target: {
                page: currentPage,
                section
              }
            })
          }}
          compact
        >
          &darr;
        </Button>
        <Button
          className="pr-1"
          onClick={event => {
            event.stopPropagation()
            onEdit({
              type: REMOVE_SECTION_FROM_PAGE,
              target: {
                page: currentPage,
                section
              }
            })
          }}
          compact
        >
          🗑
        </Button>
      </div>
    </button>
  )
}

export default SectionPreviewCard
