import { withoutInternalKeys } from '@layouthq/util'
import { MANAGE_SITE } from '../../auth/index'

export default async ({ db, authInfo }, res) => {
  try {
    const { scopes } = authInfo

    if (scopes) {
      const allowedSites = scopes.reduce(
        (allowedSites, { type, value }) =>
          type === MANAGE_SITE ? [...allowedSites, value] : allowedSites,
        []
      )

      const collection = await db.collection('sites')
      const sites = await collection
        .find({
          $or: allowedSites.map(id => ({ id }))
        })
        .toArray()

      return res.status(200).send(JSON.stringify({ data: withoutInternalKeys(sites) }))
    }

    res.status(200).send(JSON.stringify({ data: [] }))
  } catch (error) {
    console.error(`Could not get sites for user: ${error.message}`)
    res
      .status(500)
      .send({ message: `Could not get your sites: ${error.message}` })
  }
}
