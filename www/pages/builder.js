import Router, { withRouter } from 'next/router'
import React, { useEffect, useReducer } from 'react'
import axios from 'axios'

import { useUndoableReducer, RESET, UNDO, REDO } from '../hooks/use-undoable-reducer'
import Layout from '../components/layout'
import Button from '../components/button'
import Browser from '../components/browser'
import Editor from '../components/editor'
import Viewer from '../components/viewer'
import { P } from '../components/typography'

const editReducer = (state, { type, payload }) => {
  switch (type) {
    case 'CREATE_SITE':
      return payload
    case 'EDIT':
      return payload
    default:
      throw new Error('Bad dispatch.')
  }
}

const createReducer = (context) =>
  (state, { type, payload }) => {
    const { dispatchEdit } = context
    switch (type) {
      case 'ERROR':
        return {
          ...state,
          hasError: payload.error,
          isDeploying: payload.isDeploying || state.isDeploying,
          isSaving: payload.isSaving || state.isSaving,
          message: 'Something went wrong'
        }
      case 'START_LOADING_SITE':
        return {
          ...state,
          isLoading: true
        }
      case 'FINISH_LOADING_SITE':
        dispatchEdit({
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
          error: false,
          isSaving: true,
          message: 'Saving...'
        }
      case 'FINISH_CREATING':
        const href = `/builder?siteId=${site.id}`
        const as = `/sites/${site.id}/builder`
        Router.push(href, as, {
          shallow: true
        })
        dispatchEdit({
          type: 'CREATE_SITE',
          payload: {
            ...payload,
            subdomain: site.subdomain,
            components: site.components
          }
        })
        return {
          ...state,
          isSaving: false,
          isExistingSite: true,
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
          isSaving: false,
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
      default:
        throw new Error('Bad dispatch.')
    }
  }

const BuilderPage = withRouter(({ router }) => {
  const {
    state: site,
    dispatch: dispatchEdit,
    canUndo,
    canRedo
  } = useUndoableReducer(editReducer, {})

  const [state, dispatch] = useReducer(
    createReducer({ dispatchEdit }),
    {
      message: null,
      isLoading: true,
      hasError: null,
      isSaving: false,
      isDeploying: false,
      isExistingSite: router.query.siteId === 'new' ? false : true
    }
  )

  const { message, isLoading, hasError, isSaving, isDeploying, isExistingSite } = state

  const canSave = !isExistingSite || (canUndo && !isSaving)

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
            {
              dispatchEdit({
                type: 'EDIT',
                payload: site
              })
            }
          }
          isLoading={isLoading}
        />
      }
    >
      <Browser url={constructUrl(site)} content={<Viewer site={site} />} />
    </Layout>
  )
})

export default BuilderPage
