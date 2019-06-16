import { withRouter } from 'next/router'
import { useEffect, useReducer } from 'react'
import axios from 'axios'

import { useUndoableReducer, RESET, UNDO, REDO } from '../hooks/use-undoable-reducer'
import {
  builderReducer,
  ERROR,
  START_LOADING_SITE,
  FINISH_LOADING_SITE,
  EDIT_SITE,
  START_CREATING,
  FINISH_CREATING,
  START_SAVING,
  FINISH_SAVING,
  START_DEPLOYING,
  FINISH_DEPLOYING
} from '../reducers/builder'
import { siteReducer } from '../reducers/site'
import Layout from '../components/layout'
import Button from '../components/button'
import Browser from '../components/browser'
import Editor from '../components/editor'
import Renderer from '../components/renderer'
import { P } from '../components/typography'

const BuilderPage = withRouter(({ router }) => {
  const {
    state: site,
    dispatch: dispatchSiteAction,
    canUndo,
    canRedo
  } = useUndoableReducer(siteReducer, {})

  const [state, dispatchBuilderAction] = useReducer(
    builderReducer,
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

  useEffect(() => {
    const getExistingSite = async siteId =>
      (await axios.get(`${process.env.API_BASE}/sites/${siteId}`, {})).data

    const getStarterSite = () => import('../data/new-site.json')

    const getSite = async () => {
      dispatchBuilderAction({
        type: START_LOADING_SITE,
        payload: site
      })

      const site = isExistingSite
        ? await getExistingSite(router.query.siteId)
        : await getStarterSite()

      dispatchSiteAction({
        type: RESET,
        payload: site
      })
      dispatchBuilderAction({
        type: FINISH_LOADING_SITE,
        payload: site
      })
    }

    getSite()
  }, [])

  const save = async site => {
    try {
      if (isExistingSite) {
        dispatchBuilderAction({
          type: START_SAVING
        })
        const { data } = await axios.patch(`${process.env.API_BASE}/sites/${site.id}`, site)
        dispatchBuilderAction({
          type: FINISH_SAVING,
          payload: data
        })
        return data
      }
      dispatchBuilderAction({
        type: START_CREATING
      })
      const { data } = await axios.post(`${process.env.API_BASE}/sites`, site)
      dispatchSiteAction({
        type: CREATE_SITE,
        payload: {
          ...payload,
          subdomain: site.subdomain,
          components: site.components
        }
      })
      await dispatchBuilderAction({
        type: FINISH_CREATING,
        payload: data
      })
      return data
    } catch (error) {
      dispatchBuilderAction({
        type: ERROR,
        payload: {
          error,
          saving: false
        }
      })
    }
  }

  const deploy = async ({ id }) => {
    try {
      dispatchBuilderAction({
        type: START_DEPLOYING
      })
      await axios.post(`${process.env.API_BASE}/sites/${id}/deploy`, {})
      dispatchBuilderAction({
        type: FINISH_DEPLOYING
      })
    } catch (error) {
      dispatchBuilderAction({
        type: ERROR,
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
              dispatchSiteAction({
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
              dispatchSiteAction({
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
          onEdit={action => {
            dispatchSiteAction(action)
            dispatchBuilderAction({
              type: EDIT_SITE
            })
          }}
          isLoading={isLoading}
        />
      }
    >
      <Browser
        url={constructUrl(site)}
        content={<Renderer site={site} />}
        isExistingSite={isExistingSite}
      />
    </Layout>
  )
})

export default BuilderPage
