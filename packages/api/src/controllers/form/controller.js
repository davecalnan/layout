import { Router } from 'express'

import responseHandler from './response'

const router = Router()

router.post('/:domain', responseHandler)

export {
  router as controller
}
