import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'
import {
  setResponseContentTypeToJson,
  requestBodyMustNotBeEmpty
} from './middleware'
import db from './db'

import { controller as userController } from './controllers/user/controller'
import { controller as authController } from './controllers/auth/controller'
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

  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        const tokens = await database.collection('tokens')
        const validToken = await tokens.findOne({ token })

        if (validToken) {
          const users = await database.collection('users')
          const user = await users.findOne({ id: validToken.userId })

          if (!user) {
            return done(null, false)
          }

          return done(null, user, { scopes: user.scopes })
        }

        return done(null, false)

      } catch (error) {
        console.error('Authentication error:', error.message)
        return done(error)
      }
    })
  )

  app.use('/users', userController)
  app.use('/auth', authController)
  app.use('/sites', passport.authenticate('bearer', { session: false }), siteController)
  app.use('/sections', passport.authenticate('bearer', { session: false }), sectionController)
  app.use('/components', passport.authenticate('bearer', { session: false }), componentController)
  app.use('/forms', formController)

  app.listen(process.env.PORT, () => console.log(`> Ready on http://localhost:${process.env.PORT}`))
}

start()
