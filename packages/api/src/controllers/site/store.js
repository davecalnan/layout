import { getNextId, setNextId } from '../../db/auto-increment'
import { withoutId, withoutInternalKeys } from '@layouthq/util'
import { authorize, CREATE_SITES } from '../../auth'

export default async ({ db, body, authInfo }, res) => {
  try {
    if (!authorize(authInfo, [CREATE_SITES])) {
      return res.status(403).send(JSON.stringify({ message: `You are not authorized to create sites.` }))
    }

    const id = await getNextId(db, 'sites')

    const collection = await db.collection('sites')
    const response = await collection.insertOne({
      id,
      ...withoutId(body)
    })
    const site = response.ops[0]

    res.status(200).send(JSON.stringify(withoutInternalKeys(site)))

    await setNextId(db, 'sites', id)
  } catch (error) {
    console.error(error)
  }
}
