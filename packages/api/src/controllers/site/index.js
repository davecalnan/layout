import { withoutInternalKeys } from '@layouthq/util'
import { authorize, LIST_SITES } from '../../auth'

export default async ({ db, authInfo }, res) => {
  try {
    if (!authorize(authInfo, [LIST_SITES])) {
      return res.status(403).send(JSON.stringify({ message: `You are not authorized to list sites.` }))
    }

    const collection = await db.collection('sites')
    const sites = await collection.find().toArray()

    res.status(200).send(JSON.stringify({ data: withoutInternalKeys(sites) }))
  } catch (error) {
    console.error(error)
  }
}
