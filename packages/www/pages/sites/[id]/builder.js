import { useState, useRef, useReducer } from 'react'
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
import Modal from '../../../components/modal'
import SetSubdomain from '../../../components/modals/set-subdomain'
import Signup from '../../../components/modals/signup'

const BuilderPage = initialProps => {
  const token = useRef(initialProps.token)
  const [isExistingSite, setIsExistingSite] = useState(initialProps.isExistingSite)
  const [modalContent, setModalContent] = useState(null)

  const {
    state: site,
    dispatch: dispatchSiteAction,
    canUndo,
    canRedo
  } = useUndoableReducer(siteReducer, initialProps.site)

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

  const promptForSiteDetails = async () => {
    const promptSubdomain = () =>
      new Promise(resolve => {
        setModalContent(
          <SetSubdomain
            onComplete={subdomain => resolve(subdomain)}
          />
        )
      })

    const promptSignup = () =>
      new Promise(resolve => {
        setModalContent(
          <Signup onComplete={token => resolve(token)} />
        )
      })

    const subdomain = await promptSubdomain()
    if (token.current === 'guest') {
      const userToken = await promptSignup()
      token.current = userToken
    }

    setModalContent(null)

    return {
      ...site,
      subdomain
    }
  }

  const create = async site => {
    try {
      dispatchBuilderAction({
        type: START_CREATING
      })
      const { data } = await axios.post(
        `${process.env.API_BASE}/sites`,
        site,
        {
          headers: {
            Authorization: `Bearer ${token.current}`
          }
        }
      )
      dispatchBuilderAction({
        type: FINISH_CREATING,
        payload: data
      })
      setIsExistingSite(true)

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

  const save = async site => {
    try {
      dispatchBuilderAction({
        type: START_SAVING
      })
      const { data } = await axios.patch(
        `${process.env.API_BASE}/sites/${site.id}`,
        site,
        {
          headers: {
            Authorization: `Bearer ${token.current}`
          }
        }
      )
      dispatchBuilderAction({
        type: FINISH_SAVING
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
      await axios.post(
        `${process.env.API_BASE}/sites/${id}/deploy`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token.current}`
          }
        }
      )
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

  const handleSave = async () => {
    let siteToSave = site

    if (!isExistingSite) {
      siteToSave = await promptForSiteDetails()
    }

    const savedSite = isExistingSite
      ? await save(siteToSave)
      : await create(siteToSave)

    dispatchSiteAction({
      type: PERHAPS_UNWISELY_REPLACE_STATE_WITHOUT_ADDING_TO_HISTORY,
      payload: savedSite
    })

    await deploy(savedSite)
  }

  const constructURL = site => {
    if (!isExistingSite) {
      return 'Save your site to get a url 👉🏻'
    }
    const path = (currentPath && currentPath !== '/') ? currentPath : ''
    if (site.url) {
      return site.url + path
    }
    if (site.subdomain) {
      return `${site.subdomain}.onlayout.co` + path
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
      <SEO
        title={`Building ${site.subdomain || site.domain || 'a new site'}`}
      />
      <Browser
        url={constructURL(site)}
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
      <Modal
        isOpen={modalContent !== null}
        onRequestClose={() => {
          setModalContent(null)
        }}
      >
        {modalContent}
      </Modal>
    </SidebarLayout>
  )
}

BuilderPage.getInitialProps = async ctx => {
  const { query } = ctx
  const { id } = query
  const { token } = cookies.get(ctx)

  resetServerContext()

  if (query.id === 'new') {
    return {
      token: token || 'guest',
      site: await import('../../../data/new-site.json'),
      isExistingSite: false
    }
  }

  redirectIfNotAuthenticated(ctx)

  try {
    const { data: site } = await axios.get(
      `${process.env.API_BASE}/sites/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return {
      token,
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
