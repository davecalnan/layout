import React, { useState, useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'

import Layout from '../components/layout'
import Button from '../components/button'
import Browser from '../components/browser'
import Editor from '../components/editor'
import Viewer from '../components/viewer'

import site from '../demo/site.json'

const PreviewPage = () => {
  const { metadata, components: initialComponents } = site
  const [composition, updateComposition] = useState(initialComponents)
  const [loading, setLoading] = useState(true)

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
    mergePropTypes(composition, updateComposition)
  }, [])

  const url = metadata.url
    ? metadata.url
    : metadata.domain
    ? `https://${metadata.domain}`
    : 'Your Website'

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
        url={url}
        content={<Viewer composition={composition} />}
      />
    </Layout>
  )
}

export default PreviewPage
