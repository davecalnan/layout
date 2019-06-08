const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()

    server.get('/sites/:id/builder', (req, res) => {
      const actualPage = '/builder'
      const queryParams = { siteId: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, error => {
      if (error) throw error
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(error => {
    console.error(error.stack)
    process.exit(1)
  })
