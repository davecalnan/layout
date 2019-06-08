import { useState } from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import { toSentenceCase } from '../../util'
import { P, H3 } from './typography/index'
import ComponentEditor from './component-editor'
import Button from './button'

const Editor = ({ site, onEdit, loading, className }) => {
  if (loading) return <div className={className}>Loading...</div>

  const { components } = site
  const [activeSection, setActiveSection] = useState(null)

  if (activeSection !== null) {
    return (
      <section className={className}>
        <Button onClick={() => setActiveSection(null)}>&larr; Back</Button>
        <ComponentEditor site={site} component={activeSection} onEdit={onEdit} />
      </section>
    )
  }

  return (
    <section className={className}>
      <H3 className="mb-4">Components</H3>
      {site.components.map((component, index) => (
        <button
          key={`${index}-${component.name}`}
          className="w-full bg-white rounded shadow cursor-pointer p-4 mb-1"
          onClick={() => setActiveSection(component)}
        >
          <P>{toSentenceCase(component.name)}</P>
        </button>
      ))}
    </section>
  )
}

export default styled(Editor)`
${tw`p-4`}
`
