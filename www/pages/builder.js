import { withRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Layout from '../components/layout'
import Button from '../components/button'
import Browser from '../components/browser'
import Editor from '../components/editor'
import Viewer from '../components/viewer'
import { P } from '../components/typography'

const PreviewPage = withRouter(({ router }) => {
  const [loading, setLoading] = useState(true)
  const [site, updateSite] = useState({})
  const [composition, updateComposition] = useState([])
  const [edited, updateEdited] = useState(false)
  const [saving, updateSaving] = useState(false)
  const [deploying, updateDeploying] = useState(false)
  const [error, updateError] = useState(null)

  const { id } = site

  const save = async site => {
    try {
      updateError(null)
      updateSaving(true)
      await axios.patch(`${process.env.API_BASE}/sites/${site.id}`, site)
      updateSaving(false)
      updateEdited(false)
    } catch (error) {
      updateError(error)
      console.error(error)
    }
    updateSaving(false)
  }

  const deploy = async id => {
    try {
      updateDeploying(true)
      axios.post(`${process.env.API_BASE}/sites/${id}/deploy`, {})
    } catch (error) {
      updateError(error)
      console.error(error)
    }
    updateDeploying(false)
  }

  const handleSave = async site => {
    await save(site)
    await deploy(site.id)
  }

  useEffect(() => {
    const getSite = async () => {
      const { data: site } = await axios.get(`${process.env.API_BASE}/sites/${router.query.siteId}`, {})

      await updateComposition(site.components)
      updateSite(site)
    }
    getSite()
  }, [])

  useEffect(() => {
    const mergePropTypes = async (composition, updateComposition) => {
      const compositionWithPropTypes = await Promise.all(
        composition.map(async component => {
          const Component = await import(`../../components/dist/${component.name}.demo`)

          const propTypes = Object
            .entries(Component.default.propTypes)
            .reduce((acc, [prop, fn]) => {
              return {
                ...acc,
                [prop]: {
                  type: fn.type,
                  ...fn.type === 'list' ? { options: fn.options } : null
                }
              }
            }, {})

          return {
            ...component,
            propTypes
          }
        })
      )

      await updateComposition(compositionWithPropTypes)
      setLoading(false)
    }
    if (Object.keys(site).length > 0) {
      mergePropTypes(composition, updateComposition)
    }
  }, [site.components])

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
          {saving
            ? <P className="mr-4">Saving...</P>
            : deploying
            ? <P className="mr-4">Deploying...</P>
            : error
            ? <P className="mr-4">Something went wrong</P>
            : edited
            ? <P className="mr-4">Edited</P>
            : null
          }
          <Button
            onClick={() => handleSave({
              ...site,
              components: composition
            })}
            disabled={!edited || saving}
          >
            Save
          </Button>
        </div>
      )}
      sidebarContent={
        <Editor
          composition={composition}
          updateComposition={composition => {
            updateComposition(composition)
            updateEdited(true)
          }}
          loading={loading}
        />
      }
    >
      <Browser
        url={constructUrl(site)}
        content={<Viewer composition={composition} />}
      />
    </Layout>
  )
})

export default PreviewPage
