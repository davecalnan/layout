import { useState } from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import { toSentenceCase } from '../../util'
import { makeInputComponent } from './form-controls'
import { H3, P, Small } from './typography/index'
import ComponentEditor from './component-editor'
import ComponentEditCard from './component-edit-card'
import Button from './button'

const Editor = ({ site, loading, onEdit, onBack, className }) => {
  if (loading) return <div className={className}>Loading...</div>
  const { name, domain, components } = site
  const [activeIndex, setActiveIndex] = useState(null)

  /*
    If a component is selected, show the component editor.
  */
  if (activeIndex !== null) {
    return (
      <div className={className}>
        <section>
          <Button className="mb-4" onClick={() => setActiveIndex(null)}>
            &larr; Back
          </Button>
          <ComponentEditor
            site={site}
            component={components[activeIndex]}
            index={activeIndex}
            onEdit={onEdit}
          />
        </section>
      </div>
    )
  }

  /*
    If not, show a list of all the components and the details pane.
  */
  return (
    <div className={className}>
      <section>
        <H3 className="mb-4">Sections</H3>
        {components.map((component, index) => (
          <ComponentEditCard
            key={`${index}-${component}`}
            site={site}
            component={component}
            index={index}
            onClick={() => setActiveIndex(index)}
            onEdit={onEdit}
          />
        ))}
        {/* <button className="w-full h-20 flex justify-center items-center text-left bg-gray-200 rounded shadow-inner px-4 mb-2">
          <P>+</P>
        </button> */}
      </section>
      <section>
        <H3 className="mb-4">Details</H3>
        {Object.entries({ name, domain }).map(([key, value]) => {
          const InputComponent = makeInputComponent(
            { type: 'string' },
            {
              defaultValue: value,
              onChange: event => {
                onEdit({
                  ...site,
                  [key]: event.target.value
                })
              }
            }
          )
          return (
            <div key={key} className="flex flex-col mb-6">
              <label className="text-xs uppercase tracking-wide mb-1">
                {toSentenceCase(key)}
              </label>
              {InputComponent}
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default styled(Editor)`
  & > section {
    ${tw`p-4`}

    &:not(:last-child) {
      ${tw`border-b border-gray-400 pb-4 mb-4`}
    }
  }
`
