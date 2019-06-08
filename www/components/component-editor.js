import styled from 'styled-components'
import tw from 'tailwind.macro'

import { toSentenceCase } from '../../util'
import { H3 } from './typography'
import { makeInputComponent } from './form-controls'

const ComponentEditor = ({ site, component, onEdit, className, ...props }) =>
  component && (
    <section className={className} {...props}>
      <H3 className="mb-4">{toSentenceCase(component.name)}</H3>
      {Object.entries(component.propTypes).map(([propName, propType]) => {
        const InputComponent = makeInputComponent({
          propType,
          defaultValue: component.props[propName],
          onChange: event => {
            site.components[index] = {
              ...component,
              props: {
                ...component.props,
                [propName]: event.target.value
              }
            }
            onEdit(site)
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

export default styled(ComponentEditor)`
  ${tw`p-4`}

  &:not(:last-of-type) {
    ${tw`border-b border-gray-400 pb-4 mb-4`}
  }
`
