import bcrypt from 'bcrypt'
import { withoutId, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params, body }, res) => {
  try {
    const { id } = params

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10)
    }

    const users = await db.collection('users')
    const { value: user } = await users.findOneAndUpdate({ id }, {
      $set: withoutId(body)
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(withoutInternalKeys(user)))
  } catch (error) {
    console.error(error)
  }
}
