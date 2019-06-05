import styled from 'styled-components'
import tw from 'tailwind.macro'

import { toSentenceCase } from '../../util'
import { H3 } from './typography'
import { Input, Textarea, Select } from './form-controls'

const makeInputComponent = ({ propType, ...props }) => {
  switch (propType.type) {
    case 'string':
      return <Input {...props} />
    case 'text':
      return (
        <Textarea
          {...props}
          rows={5}
        />
      )
    case 'list':
      return (
        <Select {...props}>
          {propType.options.map((option, index) => (
            <option
              key={option}
              value={option}
            >
              {toSentenceCase(option)}
            </option>
          ))}
        </Select>
      )
    default:
      return '¯\\_(ツ)_/¯'
  }
}

const Editor = ({ composition, updateComposition, loading, className }) => {
  if (loading) return <div className="p-4">Loading...</div>

  return composition.map(((component, index) => {
    if (!component || !component.propTypes) return null
    return (
      <section key={index} className={className}>
        <H3 className="mb-4">{toSentenceCase(component.name)}</H3>
        {Object.entries(component.propTypes).map(([propName, propType]) => {
          const InputComponent = makeInputComponent({
            propType,
            defaultValue: component.props[propName],
            onChange: event => {
              let localComponents = [...composition]
              localComponents[index] = {
                ...component,
                props: {
                  ...component.props,
                  [propName]: event.target.value
                }
              }
              updateComposition(localComponents)
            }
          })

          return (
            <div
              key={`${component.name}-${propName}`}
              className="flex flex-col mb-6"
            >
              <label className="text-xs uppercase tracking-wide mb-1">{toSentenceCase(propName)}</label>
              {InputComponent}
            </div>
          )
        })}
      </section>
    )
  }))
}

export default styled(Editor)`
  ${tw`p-4`}

  &:not(:last-of-type) {
    ${tw`border-b border-gray-400 pb-4 mb-4`}
  }
`
