import { SiteClient } from 'datocms-client'
const client = new SiteClient('720fac6d19cb5d0e77e38bb614a6ef')

export default async (req, res) => {
  if (req.body == null) {
    return res.status(400).send({ error: 'no JSON object in the request' })
  }

  res.set('Content-Type', 'application/json')

  try {
    const item = await client.items.update(req.body.metadata.id, {
      json: JSON.stringify(req.body)
    })

    res.status(200).send(JSON.stringify(item))
  } catch (error) {
    console.error(error)
    res.status(500).send(JSON.stringify({ error }))
  }
}
