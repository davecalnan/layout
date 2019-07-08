import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db }, res) => {
  try {
    const collection = await db.collection('users')
    const users = await collection.find().toArray()

    res.status(200).send(JSON.stringify({ data: withoutInternalKeys(users) }))
  } catch (error) {
    console.error(error)
  }
}
