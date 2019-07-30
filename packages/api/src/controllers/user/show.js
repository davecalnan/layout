import _ from 'lodash'
import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params, user: authUser }, res) => {
  try {
    const { id } = params

    if (id === 'me') {
      res.status(200).send(JSON.stringify(withoutInternalKeys(authUser)))
    }

    const users = await db.collection('users')
    const user = await users.findOne({ id })
    if (_.isEmpty(user)) {
      return res
        .status(404)
        .send(JSON.stringify({ message: `Could not find user with id ${id}.` }))
    }

    res.status(200).send(JSON.stringify(withoutInternalKeys(user)))
  } catch (error) {
    console.error(error)
  }
}
