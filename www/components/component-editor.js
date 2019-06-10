import styled from 'styled-components'

import { toSentenceCase } from '../../util'
import { H3 } from './typography'
import { makeInputComponent } from './form-controls'

const ComponentEditor = ({ site, availableComponents, component, index, onEdit, className, ...props }) => {
  const { propTypes: componentPropTypes } = availableComponents.find(({ id }) => id === component.id)

  return component && (
    <section className={className} {...props}>
      <H3 className="mb-4">{toSentenceCase(component.name)}</H3>
      {Object.entries(componentPropTypes).map(([propName, propType]) => {
        const InputComponent = makeInputComponent(propType, {
          value: component.props[propName],
          onChange: event => {
            const newComponents = [...site.components]
            newComponents[index] = {
                ...component,
                props: {
                  ...component.props,
                  [propName]: event.target.value
                }
              }
            onEdit({
              ...site,
              components: newComponents
            })
          }
        })

        return (
          <div
            key={`${component.name}-${propName}`}
            className="flex flex-col mb-6"
          >
            <label className="text-xs uppercase tracking-wide mb-1">
              {toSentenceCase(propName)}
            </label>
            {InputComponent}
          </div>
        )
      })}
    </section>
  )
}

export default styled(ComponentEditor)``
