import { getNextId, setNextId } from '../../db/auto-increment'
import { withoutId, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, body }, res) => {
  try {
    const id = await getNextId(db, 'components')

    const components = await db.collection('components')
    const response = await components.insertOne({
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
