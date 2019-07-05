import { toCapitalCase } from '@layouthq/util'
import { UPDATE_COMPONENT_PROPS } from '../reducers/site'
import { H2, H3, Label } from './typography'
import Button from '../components/button'
import { makeInputComponent } from './form-controls'

const ComponentEditPanel = ({ currentPage, currentSection, component, componentPropTypes = {}, onEdit, onBack }) => {
  const { type, props } = component

  return component && (
    <>
      <div className="p-4">
        <Button onClick={onBack}>&larr; Back</Button>
      </div>
      <H2 className="px-4">{toCapitalCase(type)}</H2>
      <section>
        <H3 className="mb-4">Properties</H3>
        {Object.entries(componentPropTypes).map(([propName, propType]) => {
          const InputComponent = makeInputComponent(propType, {
            value: props[propName],
            onChange: event => {
              onEdit({
                type: UPDATE_COMPONENT_PROPS,
                target: {
                  page: currentPage,
                  section: currentSection,
                  component
                },
                payload: {
                  [propName]: event.target.value
                }
              })
            }
          })

          return (
            <div
              key={`${name}-${propName}`}
              className="flex flex-col mb-6"
            >
              <Label>{toCapitalCase(propName)}</Label>
              {InputComponent}
            </div>
          )
        })}
      </section>
    </>
  )
}

export default ComponentEditPanel
