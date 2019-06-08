import { stripInternalKeys } from '../../../util'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const sites = await db.collection('sites')
    const site = await sites.findOne({ id: Number(id) })

    res.status(200).send(JSON.stringify(stripInternalKeys(site)))
  } catch (error) {
    console.error(error)
  }
}
