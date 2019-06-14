import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
  setResponseContentTypeToJson,
  attachDatabaseConnection,
  requestBodyMustNotBeEmpty
} from './middleware'

import { controller as siteController } from './controllers/site/controller'
import { controller as componentController } from './controllers/component/controller'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(setResponseContentTypeToJson)
app.use(attachDatabaseConnection)
app.post('*', requestBodyMustNotBeEmpty)
app.put('*', requestBodyMustNotBeEmpty)
app.patch('*', requestBodyMustNotBeEmpty)

app.use('/sites', siteController)
app.use('/components', componentController)

app.listen(port, () => console.log(`> Ready on http://localhost:${process.env.PORT}`))
