import _ from 'lodash'
import { withoutId, withoutInternalKeys } from '../../helpers'

export default async ({ db, params, body }, res) => {
  try {
    const { id } = params

    const collection = await db.collection('components')
    const { value: component } = await collection.findOneAndUpdate({ id: Number(id) }, {
      $set: withoutId(body),
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(withoutInternalKeys(component)))
  } catch (error) {
    console.error(error)
  }
}
