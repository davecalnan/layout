import { withoutInternalKeys } from '@layouthq/util'
import { authorize, MANAGE_SITE } from '../../auth'

export default async ({ db, params, authInfo }, res) => {
  try {
    const { id } = params

    if (!authorize(authInfo, [MANAGE_SITE], [Number(id)])) {
      return res.status(403).send(JSON.stringify({ message: `You are not authorized to delete site id ${id}.` }))
    }

    const sites = await db.collection('sites')
    const { value: site } = await sites.findOneAndDelete({ id: Number(id) })

    res.status(200).send(JSON.stringify(withoutInternalKeys(site)))
  } catch (error) {
    console.error(error)
  }
}
