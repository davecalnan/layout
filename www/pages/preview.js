import { withRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { GraphQLClient } from 'graphql-request'
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

  const { metadata } = site

  const save = async site => {
    try {
      updateSaving(true)
      const { data } = await axios.post('/api/save', site)
      updateSaving(false)
      updateEdited(false)
      console.log(data)
    } catch (error) {
      updateError(error)
      console.error(error)
    }
    updateSaving(false)
  }

  const deploy = async id => {
    try {
      updateDeploying(true)
      const { data } = await axios.post('/api/deploy', { id })
      console.log(data)
    } catch (error) {
      updateError(error)
      console.error(error)
    }
    updateDeploying(false)
  }

  const handleSave = async site => {
    await save(site)
    await deploy(site.metadata.id)
  }

  useEffect(() => {
    const getSite = async () => {
      const client = new GraphQLClient('https://graphql.datocms.com', {
        headers: {
          Authorization: 'f8609401fef1aac3b7716778792814'
        }
      })

      const { website } = await client.request(/* GraphQL */`
        query ($id: ItemId!) {
          website(filter: { id: { eq: $id } } ) {
            id
            json
          }
        }
      `, {
        id: router.query.siteId
      })

      const site = website.json

      await updateComposition(site.components)
      updateSite(site)
    }
    getSite()
  }, [])

  useEffect(() => {
    const mergePropTypes = async (composition, updateComposition) => {
      const compositionWithPropTypes = await Promise.all(
        composition.map(async component => {
          const Component = await import(`../demo/${component.name}.demo`)

          const propTypes = Object
            .entries(Component.default.propTypes)
            .reduce((acc, [prop, fn]) => ({
              ...acc,
              [prop]: {
                type: fn.name,
                ...fn.name === 'list' ? { options: fn.options } : null
              }
            }), {})

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

  const constructUrl = metadata => {
    if (metadata) {
      if (metadata.url) return metadata.url
      if (metadata.domain) return `https://${metadata.domain}`
    }
    return 'Your Website'
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
              metadata,
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
        url={constructUrl(metadata)}
        content={<Viewer composition={composition} />}
      />
    </Layout>
  )
})

export default PreviewPage
