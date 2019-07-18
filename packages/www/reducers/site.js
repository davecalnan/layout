import { generateComponentUUIDs, generateSectionUUIDs, reorder, toCapitalCase } from '@layouthq/util'

export const UPDATE_SITE_METADATA = 'UPDATE_SITE_METADATA'
export const ADD_PAGE_TO_SITE = 'ADD_PAGE_TO_SITE'
export const UPDATE_PAGE_METADATA = 'UPDATE_PAGE_METADATA'
export const ADD_SECTION_TO_PAGE = 'ADD_SECTION_TO_PAGE'
export const REORDER_SECTIONS_ON_PAGE = 'REORDER_SECTIONS_ON_PAGE'
export const REMOVE_SECTION_FROM_PAGE = 'REMOVE_SECTION_FROM_PAGE'
export const DUPLICATE_SECTION_ON_PAGE = 'DUPLICATE_SECTION_ON_PAGE'
export const UPDATE_SECTION_METADATA = 'UPDATE_SECTION_METADATA'
export const UPDATE_SECTION_PROPS = 'UPDATE_SECTION_PROPS'
export const ADD_COMPONENT_TO_SECTION = 'ADD_COMPONENT_TO_SECTION'
export const REORDER_COMPONENTS_IN_SECTION = 'REORDER_COMPONENTS_IN_SECTION'
export const REMOVE_COMPONENT_FROM_SECTION = 'REMOVE_COMPONENT_FROM_SECTION'
export const DUPLICATE_COMPONENT_IN_SECTION = 'DUPLICATE_COMPONENT_IN_SECTION'
export const UPDATE_COMPONENT_PROPS = 'UPDATE_COMPONENT_PROPS'

export const siteReducer = (site, { type, target, payload  }) => {
  switch (type) {
    case UPDATE_SITE_METADATA:
      /*
        `payload` should be an object with the key of the metadatum to update and its new value.
      */
      return {
        ...site,
        ...payload
      }

    case ADD_PAGE_TO_SITE:
      /*
        `payload` should be the new page to add.
      */
      return {
        ...site,
        pages: [
          ...site.pages,
          {
            ...payload,
            sections: payload.sections || []
          }
        ]
      }

    case UPDATE_PAGE_METADATA:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update.
        }
        `payload` should be the an object with the key of the metadatum to update and its new value.
      */
      const updatePageMetadata = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            ...payload
          }
        })

      return {
        ...site,
        pages: updatePageMetadata({ target, payload })
      }

    case ADD_SECTION_TO_PAGE:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update.
        }
        `payload` should be the new section to add.
      */
      const addSectionToPage = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: [
              ...page.sections,
              generateSectionUUIDs(payload)
            ]
          }
        })

      return {
        ...site,
        pages: addSectionToPage({ target, payload })
      }

    case REORDER_SECTIONS_ON_PAGE:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section being moved.
        }
        `payload` should be the result passed to onDragEnd from react-beautiful-dnd.
      */
      const reorderSectionsOnPage = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: reorder(page.sections, target.section, payload)
          }
        })

      return {
        ...site,
        pages: reorderSectionsOnPage({ target, payload })
      }

    case REMOVE_SECTION_FROM_PAGE:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to remove.
        }
      */
      const removeSectionFromPage = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.reduce((sections, section) => {
              if (section === target.section) return sections

              return [...sections, section]
            }, [])
          }
        })

      return {
        ...site,
        pages: removeSectionFromPage({ target, payload })
      }

    case DUPLICATE_SECTION_ON_PAGE:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to duplicate.
        }
      */
      const duplicateSectionOnPage = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.reduce((sections, section) => {
              if (section === target.section) {
                return [
                  ...sections,
                  section,
                  generateSectionUUIDs({
                    ...section,
                    name: section.name
                      ? `${section.name} copy`
                      : `${toCapitalCase(section.type)} copy`
                  })
                ]
              }

              return [...sections, section]
            }, [])
          }
        })

      return {
        ...site,
        pages: duplicateSectionOnPage({ target, payload })
      }

    case UPDATE_SECTION_METADATA:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update.
        }
        `payload` should be the an object with the key of the metadatum to update and its new value.
      */
      const updateSectionMetadata = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                ...payload
              }
            })
          }
        })

      return {
        ...site,
        pages: updateSectionMetadata({ target, payload })
      }

    case UPDATE_SECTION_PROPS:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update.
        }
        `payload` should be an object of the form: {
          propKey: newValue
        }
      */
      const updateSectionProps = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                props: {
                  ...section.props,
                  ...payload
                }
              }
            })
          }
        })

      return {
        ...site,
        pages: updateSectionProps({ target, payload })
      }

    case ADD_COMPONENT_TO_SECTION:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update.
        }
        `payload` should be the new component to add.
      */
      const addComponentToSection = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                components: [
                  ...section.components,
                  generateComponentUUIDs(payload)
                ]
              }
            })
          }
        })

      return {
        ...site,
        pages: addComponentToSection({ target, payload })
      }

    case REORDER_COMPONENTS_IN_SECTION:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update,
          component: a reference to the section being moved.
        }
        `payload` should be the result passed to onDragEnd from react-beautiful-dnd.
      */
      const reorderComponentsInSection = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                components: reorder(
                  section.components,
                  target.component,
                  payload
                )
              }
            })
          }
        })

      return {
        ...site,
        pages: reorderComponentsInSection({ target, payload })
      }

    case REMOVE_COMPONENT_FROM_SECTION:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update.
          component: a reference to the component to remove.
        }
      */
      const removeComponentFromSection = ({ target }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                components: section.components.reduce(
                  (components, component) => {
                    if (component === target.component) return components

                    return [...components, component]
                  },
                  []
                )
              }
            })
          }
        })

      return {
        ...site,
        pages: removeComponentFromSection({ target })
      }

    case DUPLICATE_COMPONENT_IN_SECTION:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update,
          component: a reference to the section to duplicate.
        }
      */
      const duplicateComponentInSection = ({ target }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                components: section.components.reduce((components, component) => {
                  if (component === target.component) {
                    return [
                      ...components,
                      component,
                      generateComponentUUIDs(component)
                    ]
                  }

                  return [...components, component]
                }, [])
              }
            })
          }
        })

      return {
        ...site,
        pages: duplicateComponentInSection({ target })
      }

    case UPDATE_COMPONENT_PROPS:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update,
          component: a reference to the component to update.
        }
        `payload` should be an object of the form: {
          propKey: newValue
        }
      */
      const updateComponentProps = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                components: section.components.map(component => {
                  if (component !== target.component) return component

                  return {
                    ...component,
                    props: {
                      ...component.props,
                      ...payload
                    }
                  }
                })
              }
            })
          }
        })

      return {
        ...site,
        pages: updateComponentProps({ target, payload })
      }

    default:
      throw new Error('Bad dispatch.')
  }
}
