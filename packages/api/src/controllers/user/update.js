import { withoutId, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params, body }, res) => {
  try {
    const { id } = params

    const users = await db.collection('users')
    const { value: user } = await users.findOneAndUpdate({ id: Number(id) }, {
      $set: withoutId(body)
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(withoutInternalKeys(user)))
  } catch (error) {
    console.error(error)
  }
}
