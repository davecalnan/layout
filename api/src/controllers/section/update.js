import { withoutId, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params, body }, res) => {
  try {
    const { id } = params

    const collection = await db.collection('sections')
    const { value: section } = await collection.findOneAndUpdate({ id: Number(id) }, {
      $set: withoutId(body),
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(withoutInternalKeys(section)))
  } catch (error) {
    console.error(error)
  }
}
