import { getNextId, setNextId } from '../../db/auto-increment'
import { stripInternalKeys } from '../../helpers'

export default async ({ db, body }, res) => {
  try {
    const id = await getNextId(db, 'components')

    const collection = await db.collection('components')
    const response = await collection.insertOne({
      id,
      ...body
    })
    const component = response.ops[0]

    res.status(200).send(JSON.stringify(stripInternalKeys(component)))

    await setNextId(db, 'components', id)
  } catch (error) {
    console.error(error)
  }
}
