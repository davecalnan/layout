import { Draggable } from 'react-beautiful-dnd'
import { P } from './typography'
import Button from './button'
import Icon, { ICON_DOTS_VERTICAL_DOUBLE, ICON_DUPLICATE, ICON_TRASH } from './icon'

const PreviewCard = ({ name, onClick, onDelete, onDuplicate, index, id }) => (
  <Draggable draggableId={id} index={index}>
    {({ draggableProps, dragHandleProps, innerRef }) => (
      <div
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
        className="w-full h-16 flex justify-between items-center text-left bg-white rounded shadow px-4 mb-2"
        onClick={onClick}
      >
        <div className="flex items-center -ml-2 mr-4">
          <Icon
            type={ICON_DOTS_VERTICAL_DOUBLE}
            className="w-5 h-5 text-gray-500 mr-2"
          />
          <P>{name}</P>
        </div>
        <div className="flex items-center flex-shrink-0">
          <Button
            className="mr-1"
            onClick={event => {
              event.stopPropagation()
              onDuplicate()
            }}
            icon
          >
            <Icon type={ICON_DUPLICATE} className="w-6 h-6" />
          </Button>
          <Button
            onClick={event => {
              event.stopPropagation()
              onDelete()
            }}
            icon
          >
            <Icon type={ICON_TRASH} className="w-6 h-6" />
          </Button>
        </div>
      </div>
    )}
  </Draggable>
)

export default PreviewCard
