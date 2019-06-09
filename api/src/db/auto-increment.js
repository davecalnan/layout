export const getNextId = async (db, collection) => {
  try {
    const counts = await db.collection('counts')
    let result = await counts.findOne({ _id: collection })

    return result ? result.count + 1 : 1
  } catch (error) {
    throw new Error(
      `Could not get an autoincremented for collection ${collection}.`
    )
  }
}

export const setNextId = async (db, collection, count) => {
  try {
    const counts = await db.collection('counts')
    counts.insertOne({
      _id: collection,
      count
    })
  } catch (error) {
    throw new Error(
      `Could not autoincrement id for collection ${collection}.`
    )
  }
}
