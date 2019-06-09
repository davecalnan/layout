import _ from 'lodash'
import { stripInternalKeys } from '../../helpers'

export default async ({ db, params, body }, res) => {
  try {
    const { id } = params

    const collection = await db.collection('components')
    const { value: component } = await collection.findOneAndUpdate({ id: Number(id) }, {
      $set: _.pickBy(body, (value, key) => key !== 'id'),
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(stripInternalKeys(component)))
  } catch (error) {
    console.error(error)
  }
}
