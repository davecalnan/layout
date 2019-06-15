import styled from 'styled-components'

import { toSentenceCase } from '@layouthq/util'
import { UPDATE_SECTION_PROPS } from '../reducers/site'
import { H3 } from './typography'
import { makeInputComponent } from './form-controls'

const ComponentEditor = ({ site, currentPage, availableComponents, component, index, onEdit, className, ...props }) => {
  const { propTypes: componentPropTypes } = availableComponents.find(({ id }) => id === component.id)

  return component && (
    <section className={className} {...props}>
      <H3 className="mb-4">{toSentenceCase(component.name)}</H3>
      {Object.entries(componentPropTypes).map(([propName, propType]) => {
        const InputComponent = makeInputComponent(propType, {
          value: component.props[propName],
          onChange: event => {
            onEdit({
              type: UPDATE_SECTION_PROPS,
              target: {
                page: currentPage,
                section: component
              },
              payload: {
                [propName]: event.target.value
              }
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
