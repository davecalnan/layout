import { Router } from 'express'

import indexHandler from './index'
import storeHandler from './store'
import showHandler from './show'
import updateHandler from './update'
import deleteHandler from './delete'

const router = Router()

router.get('/', indexHandler)
router.post('/', storeHandler)
router.get('/:id', showHandler)
router.patch('/:id', updateHandler)
router.delete('/:id', deleteHandler)

export {
  router as controller
}
