import { moveUp, moveDown } from '@layouthq/util'

export const UPDATE_SITE_METADATA = 'UPDATE_SITE_METADATA'
export const ADD_SECTION_TO_PAGE = 'ADD_SECTION_TO_PAGE'
export const REMOVE_SECTION_FROM_PAGE = 'REMOVE_SECTION_FROM_PAGE'
export const UPDATE_SECTION_METADATA = 'UPDATE_SECTION_METADATA'
export const UPDATE_SECTION_PROPS = 'UPDATE_SECTION_PROPS'
export const MOVE_SECTION_UP = 'MOVE_SECTION_UP'
export const MOVE_SECTION_DOWN = 'MOVE_SECTION_DOWN'
export const ADD_COMPONENT_TO_SECTION = 'ADD_COMPONENT_TO_SECTION'
export const REMOVE_COMPONENT_FROM_SECTION = 'REMOVE_COMPONENT_FROM_SECTION'
export const UPDATE_COMPONENT_PROPS = 'UPDATE_COMPONENT_PROPS'
export const MOVE_COMPONENT_UP = 'MOVE_COMPONENT_UP'
export const MOVE_COMPONENT_DOWN = 'MOVE_COMPONENT_DOWN'

export const siteReducer = (site, { type, target, payload  }) => {
  switch (type) {
    case UPDATE_SITE_METADATA:
      /*
        `payload` should be the an object with the key of the metadatum to update and its new value.
      */
      return {
        ...site,
        ...payload
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
            sections: [...page.sections, payload]
          }
        })

      return {
        ...site,
        pages: addSectionToPage({ target, payload })
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

    case MOVE_SECTION_UP:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to move.
        }
      */
      const moveSectionUp = ({ target }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: moveUp(
              page.sections,
              page.sections.indexOf(target.section)
            )
          }
        })

      return {
        ...site,
        pages: moveSectionUp({ target })
      }

    case MOVE_SECTION_DOWN:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to move.
        }
      */
      const moveSectionDown = ({ target }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: moveDown(
              page.sections,
              page.sections.indexOf(target.section)
            )
          }
        })

      return {
        ...site,
        pages: moveSectionDown({ target })
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
                components: [...section.components, payload]
              }
            })
          }
        })

      return {
        ...site,
        pages: addComponentToSection({ target, payload })
      }

    case REMOVE_COMPONENT_FROM_SECTION:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update.
          component: a reference to the component to remove.
        }
      */
      const removeComponentFromSection = ({ target, payload }) =>
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
        pages: removeComponentFromSection({ target, payload })
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

    case MOVE_COMPONENT_UP:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update.
          component: a reference to the component to move.
        }
      */
      const moveComponentUp = ({ target }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                components: moveUp(
                  section.components,
                  section.components.indexOf(target.component)
                )
              }
            })
          }
        })

      return {
        ...site,
        pages: moveComponentUp({ target, payload })
      }

    case MOVE_COMPONENT_DOWN:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update,
          component: a reference to the component to move.
        }
      */
      const moveComponentDown = ({ target }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: page.sections.map(section => {
              if (section !== target.section) return section

              return {
                ...section,
                components: moveDown(
                  section.components,
                  section.components.indexOf(target.component)
                )
              }
            })
          }
        })

      return {
        ...site,
        pages: moveComponentDown({ target })
      }

    default:
      throw new Error('Bad dispatch.')
  }
}
