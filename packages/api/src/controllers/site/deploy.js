import axios from 'axios'

import { renderPageToHTML } from '@layouthq/renderer'
import { wait } from '@layouthq/util'

const http = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.ZEIT_API_KEY}`
  }
})

export default async ({ db, params }, res) => {
  const sites = await db.collection('sites')
  const site = await sites.findOne({ id: Number(params.id) })
  const { id, subdomain, pages, theme } = site

  const generateHTML = (page, options) => {
    try {
      console.log(`Building site id ${id}.`)
      const html = renderPageToHTML(page, options)
      console.log(`Finished building site id ${id}.`)
      return html
    } catch (error) {
      console.log('Could not build site:', error.message)
    }
  }

  const html = generateHTML(pages[0], { theme })

  try {
    console.log(`Deploying site id ${id}.`)
    const { data: deployment } = await http.post(
      'https://api.zeit.co/v9/now/deployments',
      {
        name: `builder-${process.env.NODE_ENV}-${id}`,
        alias: subdomain ? `${subdomain}.davecalnan.now.sh` : undefined,
        public: true,
        version: 2,
        target: 'production',
        files: [{ file: 'index.html', data: html }],
        builds: [{ src: '*.html', use: '@now/static' }]
      }
    )
    console.log(`Successfully deployed site id ${id}. (Deployment id: ${deployment.id}.)`)
    console.log(`Temporary url: '${deployment.url}'.`)

    /*
      To assign an alias to a Now deployment you must make a get request to the
      deployment endpoint *after* the deployment becomes ready.

      More info: https://zeit.co/docs/api#endpoints/deployments/create-a-new-deployment
    */
    const pollDeployment = async (id, count = 1) => {
      console.log(`(${count}) Checking if deployment for site id ${site.id} is ready...`)
      const { data: deployment } = await http.get(`https://api.zeit.co/v9/now/deployments/${id}`)
      if (deployment.readyState !== 'READY') {
        await wait(5000)
        return pollDeployment(id, count + 1)
      }
      return deployment
    }

    await pollDeployment(deployment.id)
    console.log(`Site is live at ${deployment.alias.join(', ')}.`)

    return res.status(200).send(JSON.stringify(deployment))
  } catch (error) {
    console.error('Could not deploy site:', error.message)
    return res.status(500).send(JSON.stringify({ error }))
  }
}
