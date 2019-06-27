import { withoutId, withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params, body }, res) => {
  try {
    const { id } = params

    const components = await db.collection('components')
    const { value: component } = await components.findOneAndUpdate({ id: Number(id) }, {
      $set: withoutId(body),
    }, {
      returnOriginal: false
    })

    res.status(200).send(JSON.stringify(withoutInternalKeys(component)))
  } catch (error) {
    console.error(error)
  }
}
