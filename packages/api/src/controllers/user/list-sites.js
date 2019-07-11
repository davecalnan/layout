import { withoutInternalKeys } from '@layouthq/util'
import { MANAGE_SITE } from '../../auth/index'

export default async ({ db, authInfo }, res) => {
  try {
    const { scopes } = authInfo

    const allowedSites = scopes.reduce((allowedSites, { type, value }) =>
      type === MANAGE_SITE ? [...allowedSites, value] : allowedSites
    , [])

    const collection = await db.collection('sites')
    const sites = await collection.find({
      $or: allowedSites.map(id => ({ id }))
    }).toArray()

    res.status(200).send(JSON.stringify({ data: withoutInternalKeys(sites) }))
  } catch (error) {
    console.error(error)
  }
}
