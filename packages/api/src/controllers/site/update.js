import { withoutId, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params, body }, res) => {
  try {
    const { id } = params

    const collection = await db.collection('sites')
    const { value: site } = await collection.findOneAndUpdate({ id: Number(id) }, {
      $set: withoutId(body)
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(withoutInternalKeys(site)))
  } catch (error) {
    console.error(error)
  }
}
