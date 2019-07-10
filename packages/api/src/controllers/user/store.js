import uuid from 'uuid/v4'
import bcrypt from 'bcrypt'
import { without, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, body }, res) => {
  try {
    if (!body.email || !body.password) {
      return res.status(422).send(JSON.stringify({ message: 'Email and password are required.' }))
    }

    body.password = await bcrypt.hash(body.password, 10)

    const users = await db.collection('users')
    const response = await users.insertOne({
      id: uuid(),
      ...without(body, 'id')
    })
    const user = response.ops[0]

    res.status(200).send(JSON.stringify(withoutInternalKeys(user)))

    const tokens = await db.collection('tokens')
    tokens.insertOne({
      token: uuid(),
      userId: user.id
    })

  } catch (error) {
    console.error(error)
  }
}
