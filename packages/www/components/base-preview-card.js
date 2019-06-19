import { toSentenceCase } from '@layouthq/util'
import { P } from './typography'
import Button from './button'

const BasePreviewCard = ({ name, onClick, onMoveUp, onMoveDown, onDelete }) =>
  (
    <button
      className="w-full h-16 flex justify-between items-center text-left bg-white rounded shadow px-4 mb-2"
      onClick={onClick}
    >
      <div className="mr-4">
        <P>{toSentenceCase(name)}</P>
      </div>
      <div className="flex-shrink-0">
        <Button
          className="mr-1"
          onClick={event => {
            event.stopPropagation()
            onMoveUp()
          }}
          compact
        >
          &uarr;
        </Button>
        <Button
          className="mr-1"
          onClick={event => {
            event.stopPropagation()
            onMoveDown()
          }}
          compact
        >
          &darr;
        </Button>
        <Button
          className="pr-1"
          onClick={event => {
            event.stopPropagation()
            onDelete()
          }}
          compact
        >
          🗑
        </Button>
      </div>
    </button>
  )

export default BasePreviewCard
