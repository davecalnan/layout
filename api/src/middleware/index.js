import db from '../db'

export const setResponseContentTypeToJson = (req, res, next) => {
  res.set('Content-Type', 'application/json')
  next()
}

export const attachDatabaseConnection = async (req, res, next) => {
  const connection = await db.connect()
  req.db = connection.db(process.env.MONGO_DATABASE)
  next()
}

export const requestBodyMustNotBeEmpty = ({ body }, res, next) => {
  if (body == null) {
    return res.status(400).send({ error: 'no JSON object in the request' })
  }
  next()
}
