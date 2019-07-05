import { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { toCapitalCase } from '@layouthq/util'
import {
  DUPLICATE_COMPONENT_IN_SECTION,
  REORDER_COMPONENTS_IN_SECTION,
  REMOVE_COMPONENT_FROM_SECTION,
  UPDATE_SECTION_METADATA,
  UPDATE_SECTION_PROPS,
} from '../reducers/site'
import { H2, H3, Label } from './typography'
import Button from '../components/button'
import { makeInputComponent } from './form-controls'
import ComponentEditPanel from './component-edit-panel'
import FormEditPanel from './form-edit-panel'
import PreviewCard from './preview-card'
import AddNewButton from './add-new-button'
import AddAComponent from './modals/add-a-component'

const SectionEditPanel = ({
  currentPage,
  section,
  sectionPropTypes = {},
  availableComponents = [],
  onEdit,
  onBack,
  setModalContent
}) => {
  const { name, components, props } = section
  const { children, ...otherPropTypes } = sectionPropTypes
  const [activeComponentIndex, setActiveComponentIndex] = useState()

  const activeComponent =
    activeComponentIndex !== undefined ? components[activeComponentIndex] : null

  const onDragEnd = result => {
    const component = components.find(({ uuid }) => uuid === result.draggableId)

    onEdit({
      type: REORDER_COMPONENTS_IN_SECTION,
      target: {
        page: currentPage,
        section,
        component
      },
      payload: result
    })
  }

  const determineContent = activeComponent => {
    /*
    If a component is selected, show the edit panel for that component.
    */
    if (activeComponent) {
      const activeComponentPropTypes = (availableComponents.find(({ id }) => id === activeComponent.id) || {}).propTypes
      if (activeComponent.type === 'form') {
        return (
          <FormEditPanel
            currentPage={currentPage}
            currentSection={section}
            form={activeComponent}
            formPropTypes={activeComponentPropTypes}
            onEdit={onEdit}
            onBack={() => setActiveComponentIndex()}
          />
        )
      }
      return (
        <ComponentEditPanel
          currentPage={currentPage}
          currentSection={section}
          component={activeComponent}
          componentPropTypes={activeComponentPropTypes}
          onEdit={onEdit}
          onBack={() => setActiveComponentIndex()}
        />
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
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="components">
                {({ droppableProps, innerRef, placeholder }) => (
                  <div ref={innerRef} {...droppableProps}>
                    {components.map((component, index) => (
                      <PreviewCard
                        key={component.uuid}
                        id={component.uuid}
                        index={index}
                        name={component.props.name || toCapitalCase(component.type)}
                        onClick={() => setActiveComponentIndex(index)}
                        onDelete={() => {
                          onEdit({
                            type: REMOVE_COMPONENT_FROM_SECTION,
                            target: {
                              page: currentPage,
                              section,
                              component
                            }
                          })
                        }}
                        onDuplicate={() => {
                          onEdit({
                            type: DUPLICATE_COMPONENT_IN_SECTION,
                            target: {
                              page: currentPage,
                              section,
                              component
                            }
                          })
                        }}
                      />
                    ))}
                    {placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <AddNewButton
              onClick={() =>
                setModalContent(
                  <AddAComponent
                    availableComponents={availableComponents}
                    currentPage={currentPage}
                    currentSection={section}
                    onEdit={onEdit}
                    onClose={() => setModalContent(null)}
                  />
                )
              }
            />
          </section>
        )}
        <section>
          <H3 className="mb-4">Properties</H3>
          <div className="flex flex-col mb-6">
            <Label>Name</Label>
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
                <Label>{toCapitalCase(propName)}</Label>
                {InputComponent}
              </div>
            )
          })}
        </section>
      </>
    )
  }

  return determineContent(activeComponent)
}

export default SectionEditPanel
