import { withRouter } from 'next/router'
import React, { useEffect, useReducer } from 'react'
import axios from 'axios'

import { useUndoableReducer, INIT, UNDO, REDO } from '../hooks/use-undoable-reducer'
import Layout from '../components/layout'
import Button from '../components/button'
import Browser from '../components/browser'
import Editor from '../components/editor'
import Viewer from '../components/viewer'
import { P } from '../components/typography'

const editReducer = (state, { type, payload }) => {
  switch (type) {
    case 'EDIT':
      return payload
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
    edited: false
}

const BuilderPage = withRouter(({ router }) => {
  const {
    state: site,
    dispatch: dispatchEdit,
    canUndo,
    canRedo
  } = useUndoableReducer(editReducer, {})

  const [state, dispatch] = useReducer((state, { type, payload }) => {
    switch (type) {
      case 'ERROR':
        return {
          ...state,
          error: payload.error,
          deploying: payload.deploying || state.deploying,
          saving: payload.saving || state.saving,
          message: 'Something went wrong'
        }
      case 'START_LOADING':
        return {
          ...state,
          loading: true
        }
      case 'FINISH_LOADING':
        return {
          ...state,
          loading: false
        }
      case 'START_SAVING':
        return {
          ...state,
          error: false,
          saving: true,
          message: 'Saving...'
        }
      case 'FINISH_SAVING':
        return {
          ...state,
          saving: false,
          message: null
        }
      case 'START_DEPLOYING':
        return {
          ...state,
          error: false,
          deploying: true,
          message: 'Deploying...'
        }
      case 'FINISH_DEPLOYING':
        return {
          ...state,
          deploying: false,
          message: null
        }
      case 'LOAD_SITE':
        dispatchEdit({
          type: INIT,
          payload
        })
        return {
          ...state,
          loading: false
        }
      default:
        throw new Error('Bad dispatch.')
    }
  }, initialState)

  const { message, loading, error, saving, deploying } = state

  const canSave = canUndo && !saving

  const save = async site => {
    try {
      dispatch({
        type: 'START_SAVING'
      })
      await axios.patch(`${process.env.API_BASE}/sites/${site.id}`, site)
      dispatch({
        type: 'FINISH_SAVING'
      })
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: {
          error,
          saving: false
        }
      })
    }
  }

  const deploy = async ({ id }) => {
    try {
      dispatch({
        type: 'START_DEPLOYING'
      })
      await axios.post(`${process.env.API_BASE}/sites/${id}/deploy`, {})
      dispatch({
        type: 'FINISH_DEPLOYING'
      })
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: {
          error,
          deploying: false
        }
      })
    }
  }

  const handleSave = async site => {
    await save(site)
    await deploy(site)
  }

  useEffect(() => {
    const getSite = async () => {
      const { data: site } = await axios.get(`${process.env.API_BASE}/sites/${router.query.siteId}`, {})

      dispatch({
        type: 'LOAD_SITE',
        payload: site
      })
    }
    getSite()
  }, [])

  const constructUrl = site => {
    if (loading) {
      return null
    }
    if (site.subdomain) {
      return `https://${site.subdomain}.davecalnan.now.sh`
    }
    if (!site.id) {
      return 'Save your site to get a url 👉🏻'
    }
  }

  return (
    <Layout
      headerContent={
        <div className="flex items-center">
          <P className="mr-4">{message}</P>
          <Button
            className="mr-2"
            onClick={() =>
              dispatchEdit({
                type: UNDO
              })
            }
            disabled={!canUndo}
            compact
          >
            Undo
          </Button>
          <Button
            className="mr-2"
            onClick={() =>
              dispatchEdit({
                type: REDO
              })
            }
            disabled={!canRedo}
            compact
          >
            Redo
          </Button>
          <Button
            onClick={() => handleSave(site)}
            disabled={!canSave}
            compact
          >
            💾
          </Button>
        </div>
      }
      sidebarContent={
        <Editor
          site={site}
          onEdit={site =>
            dispatchEdit({
              type: 'EDIT',
              payload: site
            })
          }
          loading={loading}
        />
      }
    >
      <Browser url={constructUrl(site)} content={<Viewer site={site} />} />
    </Layout>
  )
})

export default BuilderPage
