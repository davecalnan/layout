import _ from 'lodash'
import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const users = await db.collection('users')
    const user = await users.findOne({ id: Number(id) })
    if (_.isEmpty(user)) {
      return res.status(404).send(JSON.stringify({ message: `Could not find user with id ${id}.`}))
    }

    res.status(200).send(JSON.stringify(withoutInternalKeys(user)))
  } catch (error) {
    console.error(error)
  }
}
