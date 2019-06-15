import Router, { withRouter } from 'next/router'
import React, { useEffect, useReducer } from 'react'
import axios from 'axios'

import { useUndoableReducer, RESET, UNDO, REDO } from '../hooks/use-undoable-reducer'
import { siteReducer, CREATE_SITE, EDIT_SITE, EDIT_SUBDOMAIN } from '../reducers/site'
import Layout from '../components/layout'
import Button from '../components/button'
import Browser from '../components/browser'
import Editor from '../components/editor'
import Renderer from '../components/renderer'
import { P } from '../components/typography'

const createReducer = (context) =>
  (state, { type, payload }) => {
    const { dispatchSiteEdit } = context
    switch (type) {
      case 'ERROR':
        return {
          ...state,
          hasError: payload.error,
          isDeploying: payload.isDeploying || state.isDeploying,
          isSaving: payload.isSaving || state.isSaving,
          message: 'Something went wrong'
        }
      case EDIT_SITE:
        dispatchSiteEdit({
          type: EDIT_SITE,
          target: 'site',
          payload
        })
        return {
          ...state,
          hasUnsavedEdits: true
        }
      case 'UNDO_EDIT_SITE':
        dispatchSiteEdit({
          type: UNDO,
          payload
        })
        return {
          ...state,
          hasUnsavedEdits: true
        }
      case 'REDO_EDIT_SITE':
        dispatchSiteEdit({
          type: REDO,
          payload
        })
        return {
          ...state,
          hasUnsavedEdits: true
        }
      case 'START_LOADING_SITE':
        return {
          ...state,
          isLoading: true
        }
      case 'FINISH_LOADING_SITE':
        dispatchSiteEdit({
          type: RESET,
          payload
        })
        return {
          ...state,
          isLoading: false
        }
      case 'START_CREATING':
        return {
          ...state,
          hasError: false,
          isSaving: true,
          message: 'Saving...'
        }
      case 'FINISH_CREATING':
        const href = `/builder?siteId=${site.id}`
        const as = `/sites/${site.id}/builder`
        Router.push(href, as, {
          shallow: true
        })
        dispatchSiteEdit({
          type: CREATE_SITE,
          payload: {
            ...payload,
            subdomain: site.subdomain,
            components: site.components
          }
        })
        return {
          ...state,
          isExistingSite: true,
          isSaving: false,
          message: null
        }
      case 'START_SAVING':
        return {
          ...state,
          error: false,
          isSaving: true,
          message: 'Saving...'
        }
      case 'FINISH_SAVING':
        return {
          ...state,
          hasUnsavedEdits: false,
          isSaving: false,
          message: null
        }
      case 'START_DEPLOYING':
        return {
          ...state,
          hasError: false,
          isDeploying: true,
          message: 'Deploying...'
        }
      case 'FINISH_DEPLOYING':
        return {
          ...state,
          isDeploying: false,
          message: null
        }
      default:
        throw new Error('Bad dispatch.')
    }
  }

const BuilderPage = withRouter(({ router }) => {
  const {
    state: site,
    dispatch: dispatchSiteEdit,
    canUndo,
    canRedo
  } = useUndoableReducer(siteReducer, {})

  const [state, dispatch] = useReducer(
    createReducer({ dispatchSiteEdit }),
    {
      hasError: null,
      hasUnsavedEdits: false,
      isDeploying: false,
      isExistingSite: router.query.siteId === 'new' ? false : true,
      isLoading: true,
      isSaving: false,
      message: null
    }
  )

  const {
    hasError,
    hasUnsavedEdits,
    isDeploying,
    isExistingSite,
    isLoading,
    isSaving,
    message,
  } = state

  const canSave = !isExistingSite || (!isSaving && hasUnsavedEdits)

  const save = async site => {
    try {
      if (isExistingSite) {
        dispatch({
          type: 'START_SAVING'
        })
        const { data } = await axios.patch(`${process.env.API_BASE}/sites/${site.id}`, site)
        dispatch({
          type: 'FINISH_SAVING',
          payload: data
        })
        return data
      }
      dispatch({
        type: 'START_CREATING'
      })
      const { data } = await axios.post(`${process.env.API_BASE}/sites`, site)
      await dispatch({
        type: 'FINISH_CREATING',
        payload: data
      })
      return data
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
          isDeploying: false
        }
      })
    }
  }

  const handleSave = async site => {
    const savedSite = await save(site)
    await deploy(savedSite)
  }

  useEffect(() => {
    const getSite = async () => {
      const { data: site } = await axios.get(`${process.env.API_BASE}/sites/${router.query.siteId}`, {})

      dispatch({
        type: 'FINISH_LOADING_SITE',
        payload: site
      })
    }
    const getStarterSite = () => {
      const site = require('../data/new-site.json')

      dispatch({
        type: 'FINISH_LOADING_SITE',
        payload: site
      })
    }
    if (isExistingSite) {
      getSite()
      return
    }
    getStarterSite()
  }, [])

  const constructUrl = site => {
    if (isLoading) {
      return null
    }
    if (!isExistingSite) {
      return 'Save your site to get a url 👉🏻'
    }
    if (site.subdomain) {
      return `https://${site.subdomain}.davecalnan.now.sh`
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
              dispatchSiteEdit({
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
              dispatchSiteEdit({
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
          onEdit={action =>
            {
              dispatchSiteEdit(action)
            }
          }
          isLoading={isLoading}
        />
      }
    >
      <Browser url={constructUrl(site)} content={<Renderer site={site} />} />
    </Layout>
  )
})

export default BuilderPage
