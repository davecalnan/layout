import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db }, res) => {
  try {
    const collection = await db.collection('sections')
    const results = await collection.find().toArray()

    res.status(200).send(JSON.stringify({ data: withoutInternalKeys(results) }))
  } catch (error) {
    console.error(error)
  }
}
