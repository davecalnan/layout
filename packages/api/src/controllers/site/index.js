import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db }, res) => {
  try {
    const collection = await db.collection('sites')
    const sites = await collection.find().toArray()

    res.status(200).send(JSON.stringify({ data: withoutInternalKeys(sites) }))
  } catch (error) {
    console.error(error)
  }
}
