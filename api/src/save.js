const express = require('express')
const bodyParser = require('body-parser')
const { SiteClient } = require('datocms-client')
const client = new SiteClient('720fac6d19cb5d0e77e38bb614a6ef')

const app = express()
module.exports = app

app.use(bodyParser.json())

app.post('*', (req, res) => {
  if (req.body == null) {
    return res.status(400).send({ error: 'no JSON object in the request' })
  }

  res.set('Content-Type', 'application/json')

  client.items
    .update(req.body.metadata.id, {
      json: JSON.stringify(req.body)
    })
    .then(item => {
      res.status(200).send(JSON.stringify(item))
    })
    .catch(error => {
      console.error(error)
      res.status(500).send(JSON.stringify({ error }))
    })
})

app.all('*', (req, res) => {
  res.status(405).send({ error: 'only POST requests are accepted' })
})
