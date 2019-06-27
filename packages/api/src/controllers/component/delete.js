import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const components = await db.collection('components')
    const { value: component } = await components.findOneAndDelete({ id: Number(id) })

    res.status(200).send(JSON.stringify(withoutInternalKeys(component)))
  } catch (error) {
    console.error(error)
  }
}
