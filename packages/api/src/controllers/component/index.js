import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db }, res) => {
  try {
    const collection = await db.collection('components')
    const components = await collection.find().toArray()

    res.status(200).send(JSON.stringify({ data: withoutInternalKeys(components) }))
  } catch (error) {
    console.error(error)
  }
}
