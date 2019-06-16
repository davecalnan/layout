import styled from 'styled-components'

import { toSentenceCase } from '@layouthq/util'
import { UPDATE_SECTION_PROPS } from '../reducers/site'
import { H1 } from './typography'
import { makeInputComponent } from './form-controls'

const SectionEditPanel = ({ site, currentPage, section, propTypes, onEdit, className }) => {
  return section && (
    <section className={className}>
      <H1 className="mb-4">{toSentenceCase(section.name)}</H1>
      {Object.entries(propTypes).map(([propName, propType]) => {
        const InputComponent = makeInputComponent(propType, {
          value: section.props[propName],
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
          <div
            key={`${section.name}-${propName}`}
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

export default styled(SectionEditPanel)``
