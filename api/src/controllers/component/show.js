import _ from 'lodash'
import { withoutInternalKeys } from '../../helpers'

export default async ({ db, params }, res) => {
  try {
    const { id } = params

    const components = await db.collection('components')
    const component = await components.findOne({ id: Number(id) })
    if (_.isEmpty(component)) {
      return res.status(404).send(JSON.stringify({ message: `Could not find component with id ${id}.`}))
    }

    res.status(200).send(JSON.stringify(withoutInternalKeys(component)))
  } catch (error) {
    console.error(error)
  }
}
