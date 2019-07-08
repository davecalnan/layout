import uuid from 'uuid/v4'
import { withoutId, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, body }, res) => {
  try {
    const users = await db.collection('users')
    const response = await users.insertOne({
      id: uuid(),
      ...withoutId(body)
    })
    const user = response.ops[0]

    res.status(200).send(JSON.stringify(withoutInternalKeys(user)))
  } catch (error) {
    console.error(error)
  }
}
