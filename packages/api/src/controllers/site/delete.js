import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const collection = await db.collection('sites')
    const { value: site } = await collection.findOneAndDelete({ id: Number(id) })

    res.status(200).send(JSON.stringify(withoutInternalKeys(site)))
  } catch (error) {
    console.error(error)
  }
}
