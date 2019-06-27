import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db }, res) => {
  try {
    const components = await db.collection('components')
    const results = await components.find().toArray()

    res.status(200).send(JSON.stringify({ data: withoutInternalKeys(results) }))
  } catch (error) {
    console.error(error)
  }
}
