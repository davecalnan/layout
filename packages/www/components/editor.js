import { useState, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'
import axios from 'axios'

import { toSentenceCase } from '@layouthq/util'
import { UPDATE_PAGE_METADATA, UPDATE_SITE_METADATA } from '../reducers/site'
import { makeInputComponent } from './form-controls'
import { H3, Label } from './typography/index'
import LoadingDots from './loading-dots'
import PageSelector from './page-selector';
import SectionEditPanel from './section-edit-panel'
import SectionPreviewCard from './section-preview-card'
import AddNewButton from './add-new-button'
import Modal from './modal'
import AddASection from './modals/add-a-section'

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
  const [modalContent, setModalContent] = useState(null)

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
          setModalContent={setModalContent}
        />
      )
    }
    /*
      If not, show a list of all the sections and the details pane.
    */
    return (
      <>
        <section>
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
            onClick={() => setModalContent(
              <AddASection
                availableSections={availableSections}
                currentPage={currentPage}
                onEdit={onEdit}
                onClose={() => setModalContent(null)}
              />
            )}
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
                  <Label>{toSentenceCase(key)}</Label>
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
                  <Label>{toSentenceCase(key)}</Label>
                  {InputComponent}
                </div>
              )
            })}
          </div>
        </section>
      </>
    )
  }


  return (
    <div className={className}>
      <PageSelector
        pages={pages}
        currentPage={currentPage}
        onEdit={onEdit}
        onNavigate={path => {
          setModalContent(null)
          onNavigate(path)
        }}
        setModalContent={setModalContent}
      />
      {determineContent(activeSection)}
      <Modal
        isOpen={modalContent !== null}
        onRequestClose={() => {
          setModalContent(null)
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
      ${tw`border-b border-gray-400 pb-4`}
    }
  }
`
