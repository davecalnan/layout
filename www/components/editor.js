import { useState } from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import { toSentenceCase } from '../../util'
import { H3, P, Small } from './typography/index'
import ComponentEditor from './component-editor'
import Button from './button'

const moveDown = (array, index) => {
  if (index < 0 || index >= array.length) return array

  const copy = [...array]
  const deleted = copy.splice(index, 1)
  copy.splice(index + 1, null, ...deleted)

  return copy
}

const moveUp = (array, index) => {
  if (index <= 0 || index > array.length) return array

  const copy = [...array]
  const deleted = copy.splice(index, 1)
  copy.splice(index - 1, null, ...deleted)

  return copy
}

const Editor = ({ site, onEdit, loading, className }) => {
  if (loading) return <div className={className}>Loading...</div>

  const { components } = site
  const [activeIndex, setActiveIndex] = useState(null)

  if (activeIndex !== null) {
    return (
      <section className={className}>
        <Button
          className="mb-4"
          onClick={() => setActiveIndex(null)}
        >
          &larr; Back
        </Button>
        <ComponentEditor
          site={site}
          component={components[activeIndex]}
          index={activeIndex}
          onEdit={onEdit}
        />
      </section>
    )
  }

  return (
    <section className={className}>
      <H3 className="mb-4">Components</H3>
      {components.map((component, index) => (
        <button
          key={`${index}-${component.name}`}
          className="w-full h-20 flex justify-between items-center text-left bg-white rounded shadow px-4 mb-2"
          onClick={() => setActiveIndex(index)}
        >
          <div className="mr-4">
            <P>{toSentenceCase(component.name)}</P>
            {component.props.heading && (
              <Small>{component.props.heading}</Small>
            )}
          </div>
          <div className="flex-shrink-0">
            <Button
              className="mr-1"
              onClick={event => {
                event.stopPropagation()
                onEdit({
                  ...site,
                  components: moveUp(components, index)
                })
              }}
              compact
            >
              &uarr;
            </Button>
            <Button
              className="mr-1"
              onClick={event => {
                event.stopPropagation()
                onEdit({
                  ...site,
                  components: moveDown(components, index)
                })
              }}
              compact
            >
              &darr;
            </Button>
            <Button
              className="pr-1"
              onClick={event => {
                event.stopPropagation()
                const copy = [...components]
                copy.splice(index, 1)
                onEdit({
                  ...site,
                  components: copy
                })
              }}
              compact
            >
              🗑
            </Button>
          </div>
        </button>
      ))}
      <button className="w-full h-20 flex justify-center items-center text-left bg-gray-200 rounded shadow-inner px-4 mb-2">
        <P>+</P>
      </button>
    </section>
  )
}

export default styled(Editor)`
${tw`p-4`}
`
