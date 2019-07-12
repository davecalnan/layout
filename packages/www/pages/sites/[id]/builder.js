import { useReducer } from 'react'
import axios from 'axios'
import cookies from 'nookies'
import { resetServerContext } from 'react-beautiful-dnd'

import { useUndoableReducer } from '../../../hooks/use-undoable-reducer'

import {
  builderReducer,
  UNDO,
  REDO,
  PERHAPS_UNWISELY_REPLACE_STATE_WITHOUT_ADDING_TO_HISTORY,
  ERROR,
  EDIT_SITE,
  START_CREATING,
  FINISH_CREATING,
  START_SAVING,
  FINISH_SAVING,
  START_DEPLOYING,
  FINISH_DEPLOYING
} from '../../../reducers/builder'

import {
  navigationReducer,
  BACK,
  FORWARD,
  NAVIGATE
} from '../../../reducers/navigation'

import { siteReducer } from '../../../reducers/site'
import { redirect, redirectIfNotAuthenticated } from '../../../helpers/routing'
import SidebarLayout from '../../../components/sidebar-layout'
import SEO from '../../../components/seo'
import Button from '../../../components/button'
import Browser from '../../../components/browser'
import Editor from '../../../components/editor'
import Previewer from '../../../components/previewer'
import { P } from '../../../components/typography'

const BuilderPage = ({ http, site: initialSite, isExistingSite }) => {
  const {
    state: site,
    dispatch: dispatchSiteAction,
    canUndo,
    canRedo
  } = useUndoableReducer(siteReducer, initialSite)

  const {
    state: currentPath,
    dispatch: dispatchNavigationAction,
    canUndo: canNavigateBack,
    canRedo: canNavigateForward
  } = useUndoableReducer(navigationReducer, '/')

  const [state, dispatchBuilderAction] = useReducer(
    builderReducer,
    {
      hasError: null,
      hasUnsavedEdits: false,
      isDeploying: false,
      isSaving: false,
      message: null
    }
  )

  const {
    hasError,
    hasUnsavedEdits,
    isDeploying,
    isSaving,
    message,
  } = state

  const canSave = !isExistingSite || (!isSaving && hasUnsavedEdits)
  const canView = isExistingSite && !isDeploying

  const save = async site => {
    try {
      if (isExistingSite) {
        dispatchBuilderAction({
          type: START_SAVING
        })
        const { data } = await http.patch(`${process.env.API_BASE}/sites/${site.id}`, site)
        dispatchBuilderAction({
          type: FINISH_SAVING
        })
        return data
      }
      dispatchBuilderAction({
        type: START_CREATING
      })
      const { data } = await http.post(`${process.env.API_BASE}/sites`, site)
      await dispatchSiteAction({
        type: PERHAPS_UNWISELY_REPLACE_STATE_WITHOUT_ADDING_TO_HISTORY,
        payload: data
      })
      dispatchBuilderAction({
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
      await http.post(`${process.env.API_BASE}/sites/${id}/deploy`, {})
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
    if (!isExistingSite) {
      return 'Save your site to get a url 👉🏻'
    }
    const path = (currentPath && currentPath !== '/') ? currentPath : ''
    if (site.url) {
      return site.url + path
    }
    if (site.subdomain) {
      return `https://${site.subdomain}.onlayout.co` + path
    }
  }

  return (
    <SidebarLayout
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
          currentPath={currentPath}
          onEdit={action => {
            dispatchSiteAction(action)
            dispatchBuilderAction({
              type: EDIT_SITE
            })
          }}
          onNavigate={path => {
            dispatchNavigationAction({
              type: NAVIGATE,
              payload: path
            })
          }}
        />
      }
    >
      <SEO title={`Building ${site.subdomain || site.domain || 'a new site'}`} />
      <Browser
        url={constructUrl(site)}
        content={
          <Previewer
            site={site}
            currentPath={currentPath}
            onNavigate={path => {
              dispatchNavigationAction({
                type: NAVIGATE,
                payload: path
              })
            }}
          />
        }
        canView={canView}
        canNavigateBack={canNavigateBack}
        canNavigateForward={canNavigateForward}
        onBack={() => {
          dispatchNavigationAction({
            type: BACK
          })
        }}
        onForward={() => {
          dispatchNavigationAction({
            type: FORWARD
          })
        }}
      />
    </SidebarLayout>
  )
}

BuilderPage.getInitialProps = async ctx => {
  const { query } = ctx
  const { id } = query
  const { token } = cookies.get(ctx)

  resetServerContext()

  const http = axios.create({
    headers: {
      Authorization: `Bearer ${token || 'guest'}`
    }
  })

  const props = {
    http
  }

  if (query.id === 'new') {
    return {
      ...props,
      site: await import('../../../data/new-site.json'),
      isExistingSite: false
    }
  }

  redirectIfNotAuthenticated(ctx)

  try {
    const { data: site } = await http.get(
      `${process.env.API_BASE}/sites/${id}`
    )

    return {
      ...props,
      site,
      isExistingSite: true
    }
  } catch (error) {
    redirect({
      ctx,
      to: '/'
    })
  }
}

export default BuilderPage
