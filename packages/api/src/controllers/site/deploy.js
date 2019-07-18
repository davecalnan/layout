import fs from 'fs-extra'
import path from 'path'
import Netlify from 'netlify'
import axios from 'axios'
import { renderPageToHTML } from '@layouthq/renderer'
import { generateFilePath } from '@layouthq/util'
import { authorize, MANAGE_SITE } from '../../auth'

const netlify = new Netlify(process.env.NETLIFY_API_KEY)

const digitalOceanClient = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.DIGITALOCEAN_API_KEY}`
  }
})

const getDNSRecords = async () => {
  const { data } = await digitalOceanClient.get(
    'https://api.digitalocean.com/v2/domains/onlayout.co/records'
  )
  return data.domain_records
}

const createDNSRecord = async record => {
  const { data } = await digitalOceanClient.post(
    'https://api.digitalocean.com/v2/domains/onlayout.co/records',
    record
  )
  return data.domain_record
}

const ensureDNSRecordExists = async record => {
  console.log(`Ensuring DNS record exists for ${record.data}.`)
  const records = await getDNSRecords()

  const foundRecord = records.find(({ type, name }) => type === record.type && name === record.type)

  if (foundRecord) {
    return foundRecord
  }

  return await createDNSRecord({
    ...record,
    ttl: 30
  })
}

const createNetlifySite = async ({ id, domain, subdomain }) => {
  console.log('Creating Netlify site.')
  try {
    return await netlify.createSite({
      body: {
        name: `layout-${process.env.NODE_ENV}-${id}`,
        custom_domain: domain || `${subdomain}.onlayout.co`,
        processing_settings: {
          html: {
            pretty_urls: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Could not create site with Netlify:', error.message)
  }
}

const saveNetlifyDetails = async (sites, { id }, netlifySite) => {
  console.log('Updating site with Netlify details.')
  const { value } = await sites.findOneAndUpdate(
    { id: Number(id) },
    {
      $set: {
        netlify: {
          siteId: netlifySite.id,
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

const writeToTemporaryDirectory = async ({ id, pages, theme }, directory) => {
  console.log(`Building site id ${id}.`)

  await Promise.all(
    pages.map(async page => {
      const html = generateHTML(page, { theme })

      await fs.remove(directory)
      return await fs.outputFile(directory + generateFilePath(page.path), html)
    })
  )
  console.log(`Finished building site id ${id}.`)
}

const deploySite = async (site, directory) => {
  console.log(`Deploying site id ${site.id}.`)
  const deployment = await netlify.deploy(
    site.netlify.siteId,
    directory,
    {
      statusCb: ({ msg }) => console.log(msg)
    }
  )
  console.log(`Successfully deployed site id ${site.id}. (Deployment id: ${deployment.deployId}.)`)
  console.log(`Site is live at ${deployment.deploy.url}, https://${site.netlify.domain}.`)

  return deployment
}

const provisionSSLCert = async site => {
  console.log(`Provisioning SSL cert for site id ${site.id}`)
  return await netlify.provisionSiteTLSCertificate({
    siteId: site.netlify.siteId
  })
}

export default async ({ db, params, authInfo }, res) => {
  const { id } = params

  if (!authorize(authInfo, [MANAGE_SITE], [Number(id)])) {
    return res.status(403).send(JSON.stringify({ message: `You are not authorized to deploy site id ${id}.` }))
  }

  const sites = await db.collection('sites')
  let site = await sites.findOne({ id: Number(id) })

  try {
    console.log('Checking DNS record...')
    await ensureDNSRecordExists({
      type: 'CNAME',
      name: site.subdomain,
      data: 'sites.onlayout.co.'
    })

    if (!site.netlify || !site.netlify.siteId) {
      const netlifySite = await createNetlifySite(site)
      const updatedSite = await saveNetlifyDetails(sites, site, netlifySite)

      site = updatedSite
    }

    const tempDirectory = path.join(__dirname, 'tmp', site.netlify.name)

    await writeToTemporaryDirectory(site, tempDirectory)

    const deployment = await deploySite(site, tempDirectory)

    await provisionSSLCert(site)

    res.status(200).send(JSON.stringify(deployment))

    fs.remove(tempDirectory, error => error && console.error(error.message))
  } catch (error) {
    console.error('Could not deploy site:', error.message)

    return res.status(500).send(JSON.stringify({ error }))
  }
}
