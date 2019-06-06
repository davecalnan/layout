import React from 'react'
import ReactDOMServer from 'react-dom/server'
import axios from 'axios'
import { GraphQLClient } from 'graphql-request'

import { wait } from '../../util'

const ZEIT_API_KEY = 'GAuXnrlMPWciH0khBEYCaMQ9'

const http = axios.create({
  headers: {
    Authorization: `Bearer ${ZEIT_API_KEY}`
  }
})

const graphql = new GraphQLClient('https://graphql.datocms.com', {
  headers: {
    Authorization: 'f8609401fef1aac3b7716778792814'
  }
})

export default async (req, res) => {
  if (req.body == null) {
    return res.status(400).send({ error: 'no JSON object in the request' })
  }

  res.set('Content-Type', 'application/json')

  const { website } = await graphql.request(/* GraphQL */`
    query ($id: ItemId!) {
      website(filter: { id: { eq: $id } } ) {
        id
        json
      }
    }
  `, {
    id: req.body.id
  })

  const site = website.json

  const generateHtml = site => [
    '<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body>',
    ReactDOMServer.renderToStaticMarkup(
      site.components.map((({ name, props }, index) => {
        const Component = require(`${__dirname}/../../components/dist/${name}.demo`).default
        return React.createElement(
          Component,
          {
            ...props,
            key: index
          },
          null
        )
      }))
    ),
    '</body></html>'
  ].join('')

  try {
    console.log(`Deploying site '${site.metadata.name}'.`)
    const { data } = await http.post('https://api.zeit.co/v9/now/deployments/', {
      name: site.metadata.name,
      alias: site.metadata.domain,
      public: true,
      version: 2,
      target: 'production',
      files: [
        { file: 'index.html', data: generateHtml(site) }
      ],
      builds: [
        { src: '*.html', use: '@now/static' }
      ]
    })
    console.log(`Successfully deployed '${site.metadata.name}'. (Deployment id: ${data.id}.)`)
    console.log(`Temporary url: '${data.url}'.`)

    /*
      To assign an alias to a Now deployment you must make a get request to the
      deployment endpoint *after* the deployment becomes ready.

      More info: https://zeit.co/docs/api#endpoints/deployments/create-a-new-deployment
    */
    const pollDeployment = async (id, count = 1) => {
      console.log(`(${count}) Checking if deployment to ${site.metadata.domain} is ready...`)
      const { data } = await http.get(`https://api.zeit.co/v9/now/deployments/${id}`)
      if (data.readyState !== 'READY') {
        await wait(5000)
        return pollDeployment(id, count + 1)
      }
      return data
    }

    await pollDeployment(data.id)
    console.log(`Site is live at https://${site.metadata.domain}.`)

    res.status(200).send(JSON.stringify(data))
  } catch (error) {
    console.error('Something went wrong.')
    res.status(500).send(JSON.stringify({ error }))
  }
}
