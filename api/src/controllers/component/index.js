import { stripInternalKeys } from '../../helpers'

export default async ({ db }, res) => {
  try {
    const collection = await db.collection('components')
    const components = await collection.find().toArray()

    res.status(200).send(JSON.stringify({ data: stripInternalKeys(components) }))
  } catch (error) {
    console.error(error)
  }
}
