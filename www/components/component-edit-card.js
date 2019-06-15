import { toSentenceCase } from '@layouthq/util'
import { P, Small } from './typography'
import Button from './button'

const ComponentEditCard = ({ site, component, index, onClick, onEdit }) => {
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
              const newPages = [...site.pages]
              newPages[0].sections = moveUp(newPages[0].sections, index)
              onEdit({
                ...site,
                pages: newPages
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
              const newPages = [...site.pages]
              newPages[0].sections = moveDown(newPages[0].sections, index)
              onEdit({
                ...site,
                pages: newPages
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
            const newPages = [...site.pages]
            newPages[0].sections.splice(index, 1)
            onEdit({
              ...site,
              pages: newPages
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
