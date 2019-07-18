import { withoutId, withoutInternalKeys } from '@layouthq/util'
import { getNextId, setNextId } from '../../db/auto-increment'
import { MANAGE_SITE } from '../../auth'

export default async ({ db, body, user }, res) => {
  try {
    const id = await getNextId(db, 'sites')

    const collection = await db.collection('sites')
    const response = await collection.insertOne({
      id,
      ...withoutId(body)
    })
    const site = response.ops[0]

    const users = await db.collection('users')
    await users.findOneAndUpdate({ id: user.id }, {
      $push: {
        scopes: {
          type: MANAGE_SITE,
          value: site.id
        }
      }
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(withoutInternalKeys(site)))

    await setNextId(db, 'sites', id)
  } catch (error) {
    console.error(error)
  }
}
