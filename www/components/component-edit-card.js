import { toSentenceCase } from '@layouthq/util'
import { P, Small } from './typography'
import Button from './button'

const moveDown = (array, index) => {
  if (index === array.length -1) throw new Error(`Section is at the bottom. Can't move down.`)

  const copy = [...array]
  const deleted = copy.splice(index, 1)
  copy.splice(index + 1, null, ...deleted)

  return copy
}

const moveUp = (array, index) => {
  if (index === 0) throw new Error(`Section is at the top. Can't move up.`)

  const copy = [...array]
  const deleted = copy.splice(index, 1)
  copy.splice(index - 1, null, ...deleted)

  return copy
}

const ComponentEditCard = ({ site, component, index, onClick, onEdit }) => {
  const { components } = site

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
            try {
              onEdit({
                ...site,
                components: moveUp(components, index)
              })
            } catch (error) {
              console.error(error.message)
            }
          }}
          compact
        >
          &uarr;
        </Button>
        <Button
          className="mr-1"
          onClick={event => {
            event.stopPropagation()
            try {
              onEdit({
                ...site,
                components: moveDown(components, index)
              })
            } catch (error) {
              console.error(error.message)
            }
          }}
          compact
        >
          &darr;
        </Button>
        <Button
          className="pr-1"
          onClick={event => {
            event.stopPropagation()
            const copy = [...components]
            copy.splice(index, 1)
            onEdit({
              ...site,
              components: copy
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
