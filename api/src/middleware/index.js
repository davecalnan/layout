export const setResponseContentTypeToJson = (req, res, next) => {
  res.set('Content-Type', 'application/json')
  next()
}

export const requestBodyMustNotBeEmpty = ({ body }, res, next) => {
  if (body == null) {
    return res.status(400).send({ error: 'no JSON object in the request' })
  }
  next()
}
