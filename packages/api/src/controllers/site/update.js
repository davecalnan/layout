import { withoutId, withoutInternalKeys } from '@layouthq/util'
import { authorize, MANAGE_SITE } from '../../auth'

export default async ({ db, params, body, authInfo }, res) => {
  try {
    const { id } = params

    if (!authorize(authInfo, [MANAGE_SITE], [Number(id)])) {
      return res.status(403).send(JSON.stringify({ message: `You are not authorized to update site id ${id}.` }))
    }

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
