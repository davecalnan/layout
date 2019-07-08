import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
  setResponseContentTypeToJson,
  requestBodyMustNotBeEmpty
} from './middleware'
import db from './db'

import { controller as userController } from './controllers/user/controller'
import { controller as siteController } from './controllers/site/controller'
import { controller as sectionController } from './controllers/section/controller'
import { controller as componentController } from './controllers/component/controller'
import { controller as formController } from './controllers/form/controller'

const start = async () => {
  const app = express()

  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(setResponseContentTypeToJson)

  const connection = await db.connect()
  const database = connection.db(process.env.MONGO_DATABASE)
  app.use((req, res, next) => {
    req.db = database
    next()
  })

  app.post('*', requestBodyMustNotBeEmpty)
  app.put('*', requestBodyMustNotBeEmpty)
  app.patch('*', requestBodyMustNotBeEmpty)

  app.use('/users', userController)
  app.use('/sites', siteController)
  app.use('/sections', sectionController)
  app.use('/components', componentController)
  app.use('/forms', formController)

  app.listen(process.env.PORT, () => console.log(`> Ready on http://localhost:${process.env.PORT}`))
}

start()
