import { stripInternalKeys } from '../helpers'

export default async ({ db, params }, res) => {
  try {
    const { id } = params
    console.log(id)

    const sites = await db.collection('sites')
    const site = await sites.findOne({ id: Number(id) })
    console.log(stripInternalKeys(site))

    res.status(200).send(JSON.stringify(stripInternalKeys(site)))
  } catch (error) {
    console.error(error)
  }
}
