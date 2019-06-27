import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const sites = await db.collection('sites')
    const { value: site } = await sites.findOneAndDelete({ id: Number(id) })

    res.status(200).send(JSON.stringify(withoutInternalKeys(site)))
  } catch (error) {
    console.error(error)
  }
}
