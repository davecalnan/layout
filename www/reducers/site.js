import { moveUp, moveDown } from '@layouthq/util'

export const CREATE_SITE = 'CREATE_SITE'
export const EDIT_SITE = 'EDIT_SITE'
export const UPDATE_SITE_METADATA = 'UPDATE_SITE_METADATA'
export const ADD_SECTION_TO_PAGE = 'ADD_SECTION_TO_PAGE'
export const REMOVE_SECTION_FROM_PAGE = 'REMOVE_SECTION_FROM_PAGE'
export const UPDATE_SECTION_PROPS = 'UPDATE_SECTION_PROPS'
export const MOVE_SECTION_UP = 'MOVE_SECTION_UP'
export const MOVE_SECTION_DOWN = 'MOVE_SECTION_DOWN'

export const siteReducer = (site, { type, target, payload  }) => {
  console.log('site reducer:', { type, target, payload })
  switch (type) {
    case CREATE_SITE:
      return payload
    case EDIT_SITE:
      return payload
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
            sections: page.sections.reduce((accumulator, section) => {
              if (section === target.section) return accumulator

              return [...accumulator, section]
            }, [])
          }
        })

      return {
        ...site,
        pages: removeSectionFromPage({ target, payload })
      }
    case UPDATE_SECTION_PROPS:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update.
        }
        `payload` should be the new section to add.
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
          section: a reference to the section to update.
        }
      */
      const moveSectionUp = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: moveUp(page.sections, page.sections.indexOf(target.section))
          }
        })

      return {
        ...site,
        pages: moveSectionUp({ target, payload })
      }
    case MOVE_SECTION_DOWN:
      /*
        `target` should be an object of the form: {
          page: a reference to the page to update,
          section: a reference to the section to update.
        }
      */
      const moveSectionDown = ({ target, payload }) =>
        site.pages.map(page => {
          if (page !== target.page) return page

          return {
            ...page,
            sections: moveDown(page.sections, page.sections.indexOf(target.section))
          }
        })

      return {
        ...site,
        pages: moveSectionDown({ target, payload })
      }
    default:
      throw new Error('Bad dispatch.')
  }
}
