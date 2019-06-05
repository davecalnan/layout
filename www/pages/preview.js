import { withRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { GraphQLClient } from 'graphql-request'
import axios from 'axios'

import Layout from '../components/layout'
import Button from '../components/button'
import Browser from '../components/browser'
import Editor from '../components/editor'
import Viewer from '../components/viewer'

const PreviewPage = withRouter(({ router }) => {
  const [loading, setLoading] = useState(true)
  const [site, updateSite] = useState({})
  const [composition, updateComposition] = useState([])

  const save = async site => {
    // const response = await axios.get('/api/save')
    // console.log(response)
  }
  save()

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

  const { metadata } = site

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
        <Button
          onClick={() => console.log('I should be disabled.')}
          disabled
        >
          Save
        </Button>
      )}
      sidebarContent={
        <Editor
          composition={composition}
          updateComposition={updateComposition}
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
