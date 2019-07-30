import { Router } from 'express'
import passport from 'passport'

import indexHandler from './index'
import storeHandler from './store'
import showHandler from './show'
import updateHandler from './update'
import deleteHandler from './delete'
import listSitesHandler from './list-sites'

const controller = Router()

controller.get(
  '/',
  passport.authenticate('bearer', { session: false }),
  indexHandler
)
controller.post('/', storeHandler)
controller.get(
  '/:id',
  passport.authenticate('bearer', { session: false }),
  showHandler
)
controller.patch(
  '/:id',
  passport.authenticate('bearer', { session: false }),
  updateHandler
)
controller.delete(
  '/:id',
  passport.authenticate('bearer', { session: false }),
  deleteHandler
)
controller.get(
  '/me/sites',
  passport.authenticate('bearer', { session: false }),
  listSitesHandler
)

export { controller }
