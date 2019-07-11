import { useState } from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import availableSections from '../../sections/available.json'
import availableComponents from '../../components/available.json'

import { toCapitalCase, toSentenceCase } from '@layouthq/util'
import {
  UPDATE_SITE_METADATA,
  UPDATE_PAGE_METADATA,
  REORDER_SECTIONS_ON_PAGE,
  REMOVE_SECTION_FROM_PAGE,
  DUPLICATE_SECTION_ON_PAGE
} from '../reducers/site'
import { makeInputComponent } from './form-controls'
import { H3, Label } from './typography/index'
import LoadingDots from './loading-dots'
import PageSelector from './page-selector';
import SectionEditPanel from './section-edit-panel'
import PreviewCard from './preview-card'
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
  const [modalContent, setModalContent] = useState(null)

  const currentPage = pages.find(({ path }) => path === currentPath)
  const { sections } = currentPage
  const activeSection = activeSectionIndex !== undefined ? sections[activeSectionIndex] : null

  const pageDetails = {
    name: currentPage.name,
    path: currentPage.path,
    title: currentPage.title,
    description: currentPage.description
  }

  const siteDetails = {
    subdomain
  }

  const onDragEnd = result => {
    const section = sections.find(({ uuid }) => uuid === result.draggableId)

    onEdit({
      type: REORDER_SECTIONS_ON_PAGE,
      target: {
        page: currentPage,
        section
      },
      payload: result
    })
  }

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
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {sections.map((section, index) => (
                      <PreviewCard
                        key={section.uuid}
                        id={section.uuid}
                        index={index}
                        name={
                          section.name ||
                          toCapitalCase(section.type)
                        }
                        onOpen={() =>
                          setActiveSectionIndex(index)
                        }
                        onDelete={() => {
                          onEdit({
                            type: REMOVE_SECTION_FROM_PAGE,
                            target: {
                              page: currentPage,
                              section
                            }
                          })
                        }}
                        onDuplicate={() => {
                          onEdit({
                            type: DUPLICATE_SECTION_ON_PAGE,
                            target: {
                              page: currentPage,
                              section
                            }
                          })
                        }}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <AddNewButton
            onClick={() =>
              setModalContent(
                <AddASection
                  availableSections={availableSections}
                  currentPage={currentPage}
                  onEdit={onEdit}
                  onClose={() => setModalContent(null)}
                />
              )
            }
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
