import _ from 'lodash'
import { stripInternalKeys } from '../../helpers'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const collection = await db.collection('components')
    const { value: component } = await collection.findOneAndDelete({ id: Number(id) })

    res.status(200).send(JSON.stringify(stripInternalKeys(component)))
  } catch (error) {
    console.error(error)
  }
}
