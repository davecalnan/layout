import _ from 'lodash'
import { getNextId, setNextId } from '../../db/auto-increment'
import { withoutId, withoutInternalKeys } from '../../helpers'

export default async ({ db, body }, res) => {
  try {
    const id = await getNextId(db, 'components')

    const collection = await db.collection('components')
    const response = await collection.insertOne({
      id,
      ...withoutId(body)
    })
    const component = response.ops[0]

    res.status(200).send(JSON.stringify(withoutInternalKeys(component)))

    await setNextId(db, 'components', id)
  } catch (error) {
    console.error(error)
  }
}
