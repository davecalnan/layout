import { Router } from 'express'

import loginHandler from './login'

const controller = Router()

controller.post('/login', loginHandler)

export { controller }
