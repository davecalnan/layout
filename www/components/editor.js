import { useState, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'
import axios from 'axios'

import { toSentenceCase } from '@layouthq/util'
import { ADD_SECTION_TO_PAGE, UPDATE_SITE_METADATA } from '../reducers/site'
import { makeInputComponent } from './form-controls'
import { H3, P, Small } from './typography/index'
import SectionEditPanel from './section-edit-panel'
import SectionPreviewCard from './section-preview-card'
import Button from './button'
import Modal from 'react-modal'

const Editor = ({ site, isLoading, onEdit, className }) => {
  if (isLoading) return <div className={className}>Loading...</div>
  const { pages, subdomain } = site
  const [activeSection, setActiveSection] = useState()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [availableSections, setAvailableSections] = useState()
  const [availableComponents, setAvailableComponents] = useState()

  const currentPage = pages[0]

  useEffect(() => {
    const loadSections = async () => {
      const { data } = await axios.get(`${process.env.API_BASE}/sections`)
      const sections = data.data

      setAvailableSections(sections)
    }

    const loadComponents = async () => {
      const { data } = await axios.get(`${process.env.API_BASE}/components`)
      const components = data.data

      setAvailableComponents(components)
    }

    loadSections()
    // loadComponents()
  }, [])

  const determineContent = activeSection => {
    /*
      If a section is selected, show the section edit panel.
    */
    if (activeSection) {
      return (
        <section>
          <Button className="mb-4" onClick={() => setActiveSection(null)}>
            &larr; Back
          </Button>
          <SectionEditPanel
            site={site}
            currentPage={currentPage}
            section={activeSection}
            propTypes={availableSections.find(({ id }) => id === activeSection.id).propTypes}
            onEdit={onEdit}
          />
        </section>
      )
    }
    /*
      If not, show a list of all the components and the details pane.
    */
    return (
      <>
        <section>
          <H3 className="mb-4">Sections</H3>
          {currentPage.sections.map((section, index) => (
            <SectionPreviewCard
              key={`${index}-${section}`}
              currentPage={currentPage}
              section={section}
              onClick={() => setActiveSection(section)}
              onEdit={onEdit}
            />
          ))}
          <button
            className="w-full h-20 flex justify-center items-center text-left bg-gray-200 rounded shadow-inner px-4 mb-2"
            onClick={() => setModalIsOpen(true)}
          >
            <P>+</P>
          </button>
        </section>
        <section>
          <H3 className="mb-4">Details</H3>
          {Object.entries({ subdomain }).map(([key, value]) => {
            const InputComponent = makeInputComponent(
              { type: 'string' },
              {
                value,
                onChange: event => {
                  onEdit({
                    type: UPDATE_SITE_METADATA,
                    payload: {
                      [key]: event.target.value
                    }
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
      </>
    )
  }

  const modalContent = (
    <>
      <H3 className="mb-4">Add a section</H3>
      {availableSections
        ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))'
            }}
          >
            {availableSections.map((component, index) => (
              <button
                key={`${index}-${component.name}`}
                className="bg-white rounded shadow text-left mr-4 mb-4"
                onClick={() => {
                  onEdit({
                    type: ADD_SECTION_TO_PAGE,
                    target: {
                      page: currentPage
                    },
                    payload: {
                      id: component.id,
                      name: component.name,
                      props: component.defaultProps
                    }
                  })
                  setModalIsOpen(false)
                }}
              >
                <img
                  src="https://placehold.it/300x200"
                  className="w-full block rounded-t"
                />
                <div className="px-4 py-2">
                  <P>{toSentenceCase(component.name)}</P>
                  <Small>{component.description}</Small>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <P>
            Having trouble finding components, sorry!
          </P>
        )
      }
    </>
  )

  return (
    <div className={className}>
      {determineContent(activeSection)}
      <Modal
        appElement={typeof document !== 'undefined' && document.querySelector('__next')}
        ariaHideApp={typeof document === 'undefined' && false}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="w-full h-full max-w-2xl overflow-y-scroll rounded shadow bg-white p-8"
        overlayClassName="fixed flex justify-center items-center top-0 left-0 right-0 bottom-0"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.25)'
          },
          content: {
            maxHeight: '36rem'
          }
        }}
      >
        {modalContent}
      </Modal>
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
