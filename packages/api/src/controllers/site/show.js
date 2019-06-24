import _ from 'lodash'
import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

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