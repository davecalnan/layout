import React from 'react'
import ReactDOMServer from 'react-dom/server'
import axios from 'axios'

import { wait } from '../../../util'

const ZEIT_API_KEY = 'GAuXnrlMPWciH0khBEYCaMQ9'

const http = axios.create({
  headers: {
    Authorization: `Bearer ${ZEIT_API_KEY}`
  }
})

export default async ({ db, params, body }, res) => {
  const { id } = params

  const sites = await db.collection('sites')
  const site = await sites.findOne({ id: Number(id) })
  const { name, domain, components } = site

  const generateHtml = components => [
    '<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body>',
    ReactDOMServer.renderToStaticMarkup(
      components.map((({ name, props }, index) => {
        const Component = require(`${__dirname}/../../../components/dist/${name}.demo`).default
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
    console.log(`Deploying site '${name}'.`)
    const { data: deployment } = await http.post('https://api.zeit.co/v9/now/deployments/', {
      name: name,
      alias: domain,
      public: true,
      version: 2,
      target: 'production',
      files: [
        { file: 'index.html', data: generateHtml(components) }
      ],
      builds: [
        { src: '*.html', use: '@now/static' }
      ]
    })
    console.log(`Successfully deployed '${name}'. (Deployment id: ${deployment.id}.)`)
    console.log(`Temporary url: '${deployment.url}'.`)

    /*
      To assign an alias to a Now deployment you must make a get request to the
      deployment endpoint *after* the deployment becomes ready.

      More info: https://zeit.co/docs/api#endpoints/deployments/create-a-new-deployment
    */
    const pollDeployment = async (id, count = 1) => {
      console.log(`(${count}) Checking if deployment to ${domain} is ready...`)
      const { data: deployment } = await http.get(`https://api.zeit.co/v9/now/deployments/${id}`)
      if (deployment.readyState !== 'READY') {
        await wait(5000)
        return pollDeployment(id, count + 1)
      }
      return deployment
    }

    await pollDeployment(deployment.id)
    console.log(`Site is live at https://${domain}.`)

    res.status(200).send(JSON.stringify(deployment))
  } catch (error) {
    console.error('Something went wrong.', error)
    res.status(500).send(JSON.stringify({ error }))
  }
}
