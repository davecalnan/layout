import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import save from './save'
import deploy from './deploy'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.post('/save', save)
app.post('/deploy', deploy)

const port = 3001
app.listen(port, () => console.log(`API listening on port ${port}.`))
