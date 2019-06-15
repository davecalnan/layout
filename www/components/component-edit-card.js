import { toSentenceCase } from '@layouthq/util'
import { MOVE_SECTION_DOWN, MOVE_SECTION_UP, REMOVE_SECTION_FROM_PAGE } from '../reducers/site'
import { P, Small } from './typography'
import Button from './button'

const ComponentEditCard = ({ site, currentPage, component, index, onClick, onEdit }) => {
  return (
    <button
      key={`${index}-${component.name}`}
      className="w-full h-20 flex justify-between items-center text-left bg-white rounded shadow px-4 mb-2"
      onClick={onClick}
    >
      <div className="mr-4">
        <P>{toSentenceCase(component.name)}</P>
        {component.props.heading && (
          <Small>{component.props.heading}</Small>
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
                section: component
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
                section: component
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
                section: component
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

export default ComponentEditCard
