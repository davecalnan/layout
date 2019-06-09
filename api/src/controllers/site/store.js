import _ from 'lodash'
import { getNextId, setNextId } from '../../db/auto-increment'
import { stripInternalKeys } from '../../helpers'

export default async ({ db, body }, res) => {
  try {
    const id = await getNextId(db, 'sites')

    const collection = await db.collection('sites')
    const response = await collection.insertOne({
      id,
      ..._.pickBy(body, (value, key) => key !== 'id')
    })
    const site = response.ops[0]

    res.status(200).send(JSON.stringify(stripInternalKeys(site)))

    await setNextId(db, 'sites', id)
  } catch (error) {
    console.error(error)
  }
}
