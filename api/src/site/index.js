import { stripInternalKeys } from '../helpers'

export default async ({ db }, res) => {
  try {
    const collection = await db.collection('sites')
    const sites = await collection.find().toArray()

    res.status(200).send(JSON.stringify({ data: stripInternalKeys(sites) }))
  } catch (error) {
    console.error(error)
  }
}
