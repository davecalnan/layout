import _ from 'lodash'
import { withoutInternalKeys } from '@layouthq/util'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const sections = await db.collection('sections')
    const section = await sections.findOne({ id: Number(id) })
    if (_.isEmpty(section)) {
      return res.status(404).send(JSON.stringify({ message: `Could not find section with id ${id}.`}))
    }

    res.status(200).send(JSON.stringify(withoutInternalKeys(section)))
  } catch (error) {
    console.error(error)
  }
}
