import { toSentenceCase } from '@layouthq/util'
import { ADD_SECTION_TO_PAGE } from '../../reducers/site'
import { H2, P, Small } from '../typography'

const AddASection = ({ availableSections, currentPage, onEdit, onClose }) => (
  <>
    <H2 className="mb-4">Add a section</H2>
    {availableSections ? (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))'
        }}
      >
        {availableSections.map((section, index) => (
          <button
            key={`${index}-${section.type}`}
            className="bg-white rounded shadow text-left mr-4 mb-4"
            onClick={() => {
              onEdit({
                type: ADD_SECTION_TO_PAGE,
                target: {
                  page: currentPage
                },
                payload: {
                  id: section.id,
                  type: section.type,
                  components: section.defaultComponents,
                  props: section.defaultProps
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
              <P>{toSentenceCase(section.type)}</P>
              <Small>{section.description}</Small>
            </div>
          </button>
        ))}
      </div>
    ) : (
      <P>Having trouble finding sections, sorry!</P>
    )}
  </>
)

export default AddASection