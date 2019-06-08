import { Router } from 'express'

import indexHandler from './index'
import storeHandler from './store'
import showHandler from './show'
import updateHandler from './update'
import deleteHandler from './delete'
import deployHandler from './deploy'

const router = Router()

router.get('/', indexHandler)
router.post('/', storeHandler)
router.get('/:id', showHandler)
router.patch('/:id', updateHandler)
router.delete('/:id', deleteHandler)
router.post('/:id/deploy', deployHandler)

export {
  router as controller
}
