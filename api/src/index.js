import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
  setResponseContentTypeToJson,
  attachDatabaseConnection,
  requestBodyMustNotBeEmpty
} from './middleware'

import { controller as siteController } from './controllers/site/controller'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(setResponseContentTypeToJson)
app.use(attachDatabaseConnection)
app.post('*', requestBodyMustNotBeEmpty)
app.put('*', requestBodyMustNotBeEmpty)
app.patch('*', requestBodyMustNotBeEmpty)

app.use('/sites', siteController)

const port = 3001
app.listen(port, () => console.log(`API ready on port ${port}.`))
