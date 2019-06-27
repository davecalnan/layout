import { getNextId, setNextId } from '../../db/auto-increment'
import { withoutId, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, body }, res) => {
  try {
    const id = await getNextId(db, 'sections')

    const sections = await db.collection('sections')
    const response = await sections.insertOne({
      id,
      ...withoutId(body)
    })
    const section = response.ops[0]

    res.status(200).send(JSON.stringify(withoutInternalKeys(section)))

    await setNextId(db, 'sections', id)
  } catch (error) {
    console.error(error)
  }
}
