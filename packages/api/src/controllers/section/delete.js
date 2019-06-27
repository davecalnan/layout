import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const sections = await db.collection('sections')
    const { value: section } = await sections.findOneAndDelete({ id: Number(id) })

    res.status(200).send(JSON.stringify(withoutInternalKeys(section)))
  } catch (error) {
    console.error(error)
  }
}
