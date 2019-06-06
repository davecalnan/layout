// import { SiteClient } from 'datocms-client'
// console.log(SiteClient)
// const client = new SiteClient('720fac6d19cb5d0e77e38bb614a6ef')
import axios from 'axios'

const DATOCMS_WRITE_KEY = '720fac6d19cb5d0e77e38bb614a6ef'

const http = axios.create({
  headers: {
    Authorization: `Bearer ${DATOCMS_WRITE_KEY}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default async (req, res) => {
  if (req.body == null) {
    return res.status(400).send({ error: 'no JSON object in the request' })
  }

  res.set('Content-Type', 'application/json')

  try {
    // const item = await client.items.update(req.body.metadata.id, {
    //   json: JSON.stringify(req.body)
    // })
    const id = req.body.metadata.id
    const { data } = await http.put(`https://site-api.datocms.com/items/${id}`, {
      data: {
        type: 'item',
        id,
        attributes: {
          json: JSON.stringify(req.body)
        }
      }
    })

    res.status(200).send(JSON.stringify(data.data))
  } catch (error) {
    console.error(error)
    res.status(500).send(JSON.stringify({ error }))
  }
}
