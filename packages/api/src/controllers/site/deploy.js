import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import rimraf from 'rimraf'
import Netlify from 'netlify'
import { renderPageToHTML } from '@layouthq/renderer'

const mkdir = promisify(fs.mkdir)
const stat = promisify(fs.stat)

const netlify = new Netlify(process.env.NETLIFY_API_KEY)

const createNetlifySite = async ({ id, subdomain }) => {
  try {
    console.log('Creating new site on Netlify.')
    const netlifySite = await netlify.createSite({
      body: {
        name: `layout-${process.env.NODE_ENV}-${id}`,
        custom_domain: `${subdomain}.onlayout.co`,
        processing_settings: {
          html: {
            pretty_urls: true
          }
        }
      }
    })
    return netlifySite
  } catch (error) {
    console.error('Could not create site with Netlify:', error.message)
  }
}

const saveNetlifyDetails = async ({ id }, netlifySite) => {
  const { value } = await sites.findOneAndUpdate(
    { id: Number(id) },
    {
      $set: {
        netlify: {
          siteId: netlifySite.site_id,
          name: netlifySite.name,
          domain: `${netlifySite.name}.netlify.com`
        }
      }
    },
    {
      returnOriginal: false
    }
  )
  return value
}

const generateHTML = (page, options) => {
  try {
    const html = renderPageToHTML(page, options)
    return html
  } catch (error) {
    console.log('Could not build site:', error.message)
  }
}

const writeFile = async (filepath, content, config) => {
  const dirname = path.dirname(filepath)
  try {
    await stat(dirname)
  } catch {
    await mkdir(dirname, { recursive: true })
  }

  await promisify(fs.writeFile)(filepath, content, config)
}

const writeToTemporaryDirectory = async ({ id, pages, theme }, directory) => {
  console.log(`Building site id ${id}.`)
  const html = generateHTML(pages[0], { theme })
  await writeFile(`${directory}/index.html`, html)
  console.log(`Finished building site id ${id}.`)
}

const deploySite = async site => {
  console.log(`Deploying site id ${site.id}.`)
  const deployment = await netlify.deploy(
    site.netlify.siteId,
    `${__dirname}/tmp/${site.netlify.name}/`,
    {
      statusCb: ({ msg }) => console.log(msg)
    }
  )
  console.log(`Successfully deployed site id ${site.id}. (Deployment id: ${deployment.deployId}.)`)
  console.log(`Site is live at ${deployment.deploy.url}, https://${site.netlify.domain}.`)

  return deployment
}

export default async ({ db, params }, res) => {
  const sites = await db.collection('sites')
  let site = await sites.findOne({ id: Number(params.id) })

  if (!site.netlify || !site.netlify.siteId) {
    const netlifySite = await createNetlifySite(site)
    const updatedSite = await saveNetlifyDetails(site, netlifySite)

    site = updatedSite
  }

  const tempDirectory = `${__dirname}/tmp/${site.netlify.name}`

  await writeToTemporaryDirectory(site, tempDirectory)

  try {
    const deployment = await deploySite(site)

    res.status(200).send(JSON.stringify(deployment))
  } catch (error) {
    console.error('Could not deploy site:', error.message)

    return res.status(500).send(JSON.stringify({ error }))
  } finally {
    await rimraf(tempDirectory, error => error && console.error(error.message))
  }
}
