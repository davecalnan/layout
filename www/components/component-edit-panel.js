import { toSentenceCase } from '@layouthq/util'
import { UPDATE_COMPONENT_PROPS } from '../reducers/site'
import { H1, H2 } from './typography'
import Button from '../components/button'
import { makeInputComponent } from './form-controls'

const ComponentEditPanel = ({ currentPage, currentSection, component, componentPropTypes = {}, onEdit, onBack }) => {
  const { name, props } = component
  return (
    component && (
      <>
        <div className="p-4">
          <Button onClick={onBack}>&larr; Back</Button>
        </div>
        <H1 className="px-4">{toSentenceCase(name)}</H1>
        <section>
          <H2 className="mb-4">Properties</H2>
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
              <div key={`${name}-${propName}`} className="flex flex-col mb-6">
                <label className="text-xs uppercase tracking-wide mb-1">
                  {toSentenceCase(propName)}
                </label>
                {InputComponent}
              </div>
            )
          })}
        </section>
      </>
    )
  )
}

export default ComponentEditPanel
