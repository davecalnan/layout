import _ from 'lodash'
import { stripInternalKeys } from '../../../util'

export default async ({ db, params, body }, res) => {
  try {
    const { id } = params

    const collection = await db.collection('sites')
    const { value: site } = await collection.findOneAndUpdate({ id: Number(id) }, {
      $set: _.pickBy(body, (value, key) => key !== 'id'),
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(stripInternalKeys(site)))
  } catch (error) {
    console.error(error)
  }
}
