import { toCapitalCase } from '@layouthq/util'
import { ADD_COMPONENT_TO_SECTION } from '../../reducers/site'
import { H2, P, Small } from '../typography'

const AddAComponent = ({ availableComponents, currentPage, currentSection, onEdit, onClose }) => (
  <>
    <H2 className="mb-4">Add a component</H2>
    {availableComponents ? (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))'
        }}
      >
        {availableComponents.map((component, index) => (
          <button
            key={`${index}-${component.type}`}
            className="bg-white rounded shadow text-left mr-4 mb-4"
            onClick={() => {
              onEdit({
                type: ADD_COMPONENT_TO_SECTION,
                target: {
                  page: currentPage,
                  section: currentSection
                },
                payload: {
                  id: component.id,
                  type: component.type,
                  props: component.defaultProps
                }
              })
              onClose()
            }}
          >
            <img
              src="https://placehold.it/300x200"
              className="w-full block rounded-t"
            />
            <div className="px-4 py-2">
              <P>{toCapitalCase(component.type)}</P>
              <Small>{component.description}</Small>
            </div>
          </button>
        ))}
      </div>
    ) : (
      <P>Having trouble finding components, sorry!</P>
    )}
  </>
)

export default AddAComponent