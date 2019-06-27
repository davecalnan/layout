import { without } from '@layouthq/util'

export default async (req, res) => {
  try {
    const { db, params, body } = req
    const { domain } = params
    const referer = req.get('Referer')

    const sites = await db.collection('sites')
    const site = await sites.findOne({ domain })

    const collection = await db.collection('formResponses')
    await collection.insertOne({
      form: body['form-name'],
      siteId: site.id,
      referer,
      body: without(body, 'form-name')
    })

    res.set('Content-Type', 'text/html')
    res.status(201).send(`<p>Thank you for submitting.</p><a href="${referer}">Go back &rarr;</a>`)
  } catch (error) {
    console.error(error)
  }
}
