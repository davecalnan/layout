import _ from 'lodash'
import { withoutInternalKeys } from '@layouthq/util'
import { authorize, MANAGE_SITE } from '../../auth'

export default async ({ db, params, authInfo }, res) => {
  try {
    const { id } = params

    if (!authorize(authInfo, [MANAGE_SITE], [Number(id)])) {
      return res.status(403).send(JSON.stringify({ message: `You are not authorized to view site id ${id}.` }))
    }

    const sites = await db.collection('sites')
    const site = await sites.findOne({ id: Number(id) })
    if (_.isEmpty(site)) {
      return res.status(404).send(JSON.stringify({ message: `Could not find site with id ${id}.`}))
    }

    res.status(200).send(JSON.stringify(withoutInternalKeys(site)))
  } catch (error) {
    console.error(error)
  }
}
