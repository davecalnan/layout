import { stripInternalKeys } from '../../../util'

const getNextId = async (db, collection) => {
  try {
    const counts = await db.collection('counts')
    let result = await counts.findOne({ _id: collection })

    return result ? result.count + 1 : 1
  } catch (error) {
    console.error(`Could not get an autoincremented for collection ${collection}.`)
  }
}

const setNextId = async (db, collection, count) => {
  try {
    const counts = await db.collection('counts')
    counts.insertOne({
      _id: collection,
      count
    })
  } catch (error) {
    console.error(`Could not autoincrement id for collection ${collection}.`)
  }
}

export default async ({ db, body }, res) => {
  try {
    const id = await getNextId(db, 'sites')

    const collection = await db.collection('sites')
    const response = await collection.insertOne({
      id,
      ...body
    })
    const site = response.ops[0]

    res.status(200).send(JSON.stringify(stripInternalKeys(site)))

    await setNextId(db, 'sites', id)
  } catch (error) {
    console.error(error)
  }
}
