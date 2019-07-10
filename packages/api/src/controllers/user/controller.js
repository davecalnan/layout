import { Router } from 'express'
import passport from 'passport'

import indexHandler from './index'
import storeHandler from './store'
import showHandler from './show'
import updateHandler from './update'
import deleteHandler from './delete'

const router = Router()

router.get('/', passport.authenticate('bearer', { session: false }), indexHandler)
router.post('/', storeHandler)
router.get('/:id', passport.authenticate('bearer', { session: false }), showHandler)
router.patch('/:id', passport.authenticate('bearer', { session: false }), updateHandler)
router.delete('/:id', passport.authenticate('bearer', { session: false }), deleteHandler)

export {
  router as controller
}
