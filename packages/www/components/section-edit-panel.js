import { useState } from 'react'

import { toCapitalCase } from '@layouthq/util'
import { ADD_COMPONENT_TO_SECTION, UPDATE_SECTION_METADATA, UPDATE_SECTION_PROPS } from '../reducers/site'
import { H2, H3, P, Small } from './typography'
import Button from '../components/button'
import { makeInputComponent } from './form-controls'
import ComponentEditPanel from './component-edit-panel'
import ComponentPreviewCard from './component-preview-card'
import AddNewButton from './add-new-button'
import Modal from './modal'

const SectionEditPanel = ({ currentPage, section, sectionPropTypes = {}, availableComponents = [], onEdit, onBack }) => {
  const { name, components, props } = section
  const { children, ...otherPropTypes } = sectionPropTypes
  const [activeComponentIndex, setActiveComponentIndex] = useState()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const activeComponent = activeComponentIndex !== undefined ? components[activeComponentIndex] : null

  const determineContent = activeComponent => {
    /*
    If a component is selected, show the edit panel for that component.
    */
    if (activeComponent) {
      const activeComponentPropTypes = (availableComponents.find(({ id }) => id === activeComponent.id) || {}).propTypes
      return (
        <>
          <ComponentEditPanel
            currentPage={currentPage}
            currentSection={section}
            component={activeComponent}
            componentPropTypes={activeComponentPropTypes}
            onEdit={onEdit}
            onBack={() => setActiveComponentIndex()}
          />
        </>
      )
    }
    /*
      If not, show a list of all the components and the props pane.
    */
    return (
      <>
        <div className="p-4">
          <Button onClick={onBack}>&larr; Back</Button>
        </div>
        <H2 className="px-4">
          {section.name || toCapitalCase(section.type)}
        </H2>
        {components && (
          <section>
            <H3 className="mb-4">Components</H3>
            {components.map((component, index) => (
              <ComponentPreviewCard
                key={`${index}-${component}`}
                currentPage={currentPage}
                currentSection={section}
                component={component}
                onClick={() => setActiveComponentIndex(index)}
                onEdit={onEdit}
                canMoveUp={index !== 0}
                canMoveDown={index !== components.length - 1}
              />
            ))}
            <AddNewButton onClick={() => setModalIsOpen(true)} />
          </section>
        )}
        <section>
          <H3 className="mb-4">Properties</H3>
          <div className="flex flex-col mb-6">
            <label className="text-xs uppercase tracking-wide mb-1">
              Name
            </label>
            {makeInputComponent(
              {
                type: 'string'
              },
              {
                value: name,
                onChange: event => {
                  onEdit({
                    type: UPDATE_SECTION_METADATA,
                    target: {
                      page: currentPage,
                      section
                    },
                    payload: {
                      name: event.target.value
                    }
                  })
                }
              }
            )}
          </div>
          {Object.entries(otherPropTypes).map(([propName, propType]) => {
            const InputComponent = makeInputComponent(propType, {
              value: props[propName],
              onChange: event => {
                onEdit({
                  type: UPDATE_SECTION_PROPS,
                  target: {
                    page: currentPage,
                    section
                  },
                  payload: {
                    [propName]: event.target.value
                  }
                })
              }
            })

            return (
              <div key={propName} className="flex flex-col mb-6">
                <label className="text-xs uppercase tracking-wide mb-1">
                  {toCapitalCase(propName)}
                </label>
                {InputComponent}
              </div>
            )
          })}
        </section>
      </>
    )
  }

  const modalContent = (
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
              key={`${index}-${component.name}`}
              className="bg-white rounded shadow text-left mr-4 mb-4"
              onClick={() => {
                onEdit({
                  type: ADD_COMPONENT_TO_SECTION,
                  target: {
                    page: currentPage,
                    section
                  },
                  payload: {
                    id: component.id,
                    name: component.name,
                    props: component.defaultProps
                  }
                })
                setModalIsOpen(false)
              }}
            >
              <img
                src="https://placehold.it/300x200"
                className="w-full block rounded-t"
              />
              <div className="px-4 py-2">
                <P>{toCapitalCase(component.name)}</P>
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

  return (
    <>
      {determineContent(activeComponent)}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        {modalContent}
      </Modal>
    </>
  )
}

export default SectionEditPanel
