import { withRouter } from 'next/router'
import React, { useEffect, useReducer } from 'react'
import axios from 'axios'

import { useUndoableReducer, UNDO, REDO } from '../hooks/use-undoable-reducer'
import Layout from '../components/layout'
import Button from '../components/button'
import Browser from '../components/browser'
import Editor from '../components/editor'
import Viewer from '../components/viewer'
import { P } from '../components/typography'

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'ERROR':
      return {
      ...state,
      error: payload,
      message: 'Something went wrong'
    }
    case 'START_LOADING': return {
      ...state,
      loading: true
    }
    case 'FINISH_LOADING': return {
      ...state,
      loading: false
    }
    case 'START_SAVING': return {
      ...state,
      error: false,
      saving: true,
      message: 'Saving...'
    }
    case 'FINISH_SAVING': return {
      ...state,
      saving: false,
      message: null
    }
    case 'START_DEPLOYING': return {
      ...state,
      error: false,
      deploying: true,
      message: 'Deploying...'
    }
    case 'FINISH_DEPLOYING': return {
      ...state,
      deploying: false,
      message: null
    }
    case 'EDIT_SITE': return {
      ...state,
      edited: true,
      message: 'Edited',
      site: payload
    }
    case 'UPDATE_SITE': return {
      ...state,
      loading: false,
      site: payload
    }
    default:
      throw new Error('Bad dispatch.')
  }
}

const initialState = {
    message: null,
    loading: true,
    error: null,
    saving: false,
    deploying: false,
    edited: false,
    site: {},
}

const BuilderPage = withRouter(({ router }) => {
  /*
    This is definitely going to be an issue. This component edits state
    based on isSaving, isDeploying etc. The undoableReducer adds these
    to its state in its current implemenation. It won't undo the API
    calls or anything but it will mess up the UI's understanding of
    what's happening.
  */
  const { state, dispatch, canUndo, canRedo } = useUndoableReducer(reducer, initialState)
  const {
    message,
    loading,
    error,
    saving,
    deploying,
    edited,
    site
  } = state

  const { id } = site

  const canSave = edited && !saving

  const save = async site => {
    try {
      dispatch({
        type: 'START_SAVING'
      })
      await axios.patch(`${process.env.API_BASE}/sites/${site.id}`, site)
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: error
      })
    }
    dispatch({
      type: 'FINISH_SAVING'
    })
  }

  const deploy = async id => {
    try {
      dispatch({
        type: 'START_DEPLOYING'
      })
      await axios.post(`${process.env.API_BASE}/sites/${id}/deploy`, {})
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: error
      })
    }
    dispatch({
      type: 'FINISH_DEPLOYING'
    })
  }

  const handleSave = async site => {
    await save(site)
    await deploy(site.id)
  }

  useEffect(() => {
    const getSite = async () => {
      const { data: site } = await axios.get(`${process.env.API_BASE}/sites/${router.query.siteId}`, {})

      dispatch({
        type: 'UPDATE_SITE',
        payload: site
      })
    }
    getSite()
  }, [])

  // useEffect(() => {
  //   const mergePropTypes = async (composition, updateComposition) => {
  //     const compositionWithPropTypes = await Promise.all(
  //       composition.map(async component => {
  //         const Component = await import(`../../components/dist/${component.name}.demo`)

  //         const propTypes = Object
  //           .entries(Component.default.propTypes)
  //           .reduce((acc, [prop, fn]) => {
  //             return {
  //               ...acc,
  //               [prop]: {
  //                 type: fn.type,
  //                 ...fn.type === 'list' ? { options: fn.options } : null
  //               }
  //             }
  //           }, {})

  //         return {
  //           ...component,
  //           propTypes
  //         }
  //       })
  //     )

  //     dispatch({
  //       type: 'UPDATE_SITE',
  //       payload: {
  //         ...site,
  //         components: compositionWithPropTypes
  //       }
  //     })

  //     dispatch({
  //       type: 'FINISH_LOADING'
  //     })

  //     // await updateComposition(compositionWithPropTypes)
  //     // setLoading(false)
  //   }
  //   if (Object.keys(site).length > 0) {
  //     mergePropTypes(site.components)
  //   }
  // }, [site.components])

  const constructUrl = site => {
    if (site) {
      if (site.url) return site.url
      if (site.domain) return `https://${site.domain}`
    }
    return null
  }

  return (
    <Layout
      headerContent={(
        <div className="flex items-center">
          <P className="mr-4">{message}</P>
          <Button
            className="mr-2"
            onClick={() => dispatch({
              type: UNDO
            })}
            disabled={!canUndo || !edited}
          >
            Undo
          </Button>
          <Button
            className="mr-2"
            onClick={() => dispatch({
              type: REDO
            })}
            disabled={!canRedo}
          >
            Redo
          </Button>
          <Button
            onClick={() => handleSave(site)}
            disabled={!canSave}
          >
            Save
          </Button>
        </div>
      )}
      sidebarContent={
        <Editor
          site={site}
          onEdit={site => dispatch({
              type: 'EDIT_SITE',
              payload: site
            })}
          loading={loading}
        />
      }
    >
      <Browser
        url={constructUrl(site)}
        content={<Viewer site={site} />}
      />
    </Layout>
  )
})

export default BuilderPage
