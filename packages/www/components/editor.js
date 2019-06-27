import { useState, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'
import axios from 'axios'

import { toSentenceCase } from '@layouthq/util'
import { ADD_SECTION_TO_PAGE, UPDATE_PAGE_METADATA, UPDATE_SITE_METADATA } from '../reducers/site'
import { makeInputComponent } from './form-controls'
import { H2, H3, P, Small } from './typography/index'
import LoadingDots from './loading-dots'
import SectionEditPanel from './section-edit-panel'
import SectionPreviewCard from './section-preview-card'
import AddNewButton from './add-new-button'
import Modal from './modal'

const PageSelector = ({ pages, currentPath, onNavigate }) => (
  <select
    value={currentPath}
    onChange={event => onNavigate(event.target.value)}
    className="w-full appearance-none bg-white rounded shadow font-bold leading-tight text-3xl px-4 py-1"
  >
    {pages.map(({ path, name }) => {
      return <option key={path} value={path}>{name}</option>
    })}
  </select>
)

const Editor = ({ site, currentPath, isLoading, onEdit, onNavigate, className }) => {
  if (isLoading) return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4">
      <LoadingDots />
    </div>
  )
  const { pages, subdomain } = site
  const [activeSectionIndex, setActiveSectionIndex] = useState()
  const [availableSections, setAvailableSections] = useState([])
  const [availableComponents, setAvailableComponents] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const currentPage = pages.find(({ path }) => path === currentPath)
  const { sections } = currentPage
  const activeSection = activeSectionIndex !== undefined ? sections[activeSectionIndex] : null

  const pageDetails = {
    name: currentPage.name,
    path: currentPage.path
  }

  const siteDetails = {
    subdomain
  }

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
    loadComponents()
  }, [])

  const determineContent = activeSection => {
    /*
      If a section is selected, show the edit panel for that section.
    */
    if (activeSection) {
      const activeSectionPropTypes = (availableSections.find(({ id }) => id === activeSection.id) || {}).propTypes
      return (
        <SectionEditPanel
          currentPage={currentPage}
          section={activeSection}
          sectionPropTypes={activeSectionPropTypes}
          availableComponents={availableComponents}
          onEdit={onEdit}
          onBack={() => setActiveSectionIndex()}
        />
      )
    }
    /*
      If not, show a list of all the sections and the details pane.
    */
    return (
      <>
        <section>
          <H2 className="mb-4">Page</H2>
          <H3>Sections</H3>
          <div className="mt-4">
            {sections.map((section, index) => (
              <SectionPreviewCard
                key={`${index}-${section}`}
                currentPage={currentPage}
                section={section}
                onClick={() => setActiveSectionIndex(index)}
                onEdit={onEdit}
                canMoveUp={index !== 0}
                canMoveDown={index !== sections.length - 1}
              />
            ))}
          </div>
          <AddNewButton
            onClick={() => setModalIsOpen(true)}
          />
        </section>
        <section>
          <H3>Page Details</H3>
          <div className="mt-4">
            {Object.entries(pageDetails).map(([key, value]) => {
              const InputComponent = makeInputComponent(
                { type: 'string' },
                {
                  value,
                  onChange: event => {
                    onEdit({
                      type: UPDATE_PAGE_METADATA,
                      target: {
                        page: currentPage
                      },
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
          </div>
        </section>
        <section>
          <H3>Site Details</H3>
          <div className="mt-4">
            {Object.entries(siteDetails).map(([key, value]) => {
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
          </div>
        </section>
      </>
    )
  }

  const determineModalContent = activeSection => {
    if (!activeSection) {
      return (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
        >
          <H2 className="mb-4">Add a section</H2>
          {availableSections ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(10rem, 1fr))'
              }}
            >
              {availableSections.map((section, index) => (
                <button
                  key={`${index}-${section.type}`}
                  className="bg-white rounded shadow text-left mr-4 mb-4"
                  onClick={() => {
                    onEdit({
                      type: ADD_SECTION_TO_PAGE,
                      target: {
                        page: currentPage
                      },
                      payload: {
                        id: section.id,
                        type: section.type,
                        components: section.defaultComponents,
                        props: section.defaultProps
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
                    <P>{toSentenceCase(section.type)}</P>
                    <Small>{section.description}</Small>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <P>Having trouble finding sections, sorry!</P>
          )}
        </Modal>
      )
    }

    return null
  }

  return (
    <div className={className}>
      <PageSelector pages={pages} currentPath={currentPath} onNavigate={onNavigate} />
      {determineContent(activeSection)}
      {determineModalContent(activeSection)}
    </div>
  )
}

export default styled(Editor)`
  & > section {
    ${tw`p-4`}

    &:not(:last-child) {
      ${tw`border-b border-gray-400 pb-4`}
    }
  }
`
