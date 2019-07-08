import { without } from '@layouthq/util'

export default async (req, res) => {
  try {
    const { db, params, body } = req
    const { domain } = params
    const referrer = req.get('Referer')

    const sites = await db.collection('sites')
    const site = await sites.findOne({ domain })

    const afterSubmit = body['after-submit'] ? JSON.parse(body['after-submit']) : undefined

    const formResponses = await db.collection('formResponses')
    await formResponses.insertOne({
      form: body['form-name'],
      siteId: site.id,
      referrer,
      body: without(body, 'form-name', 'after-submit')
    })

    res.set('Content-Type', 'text/html')

    res.status(201).send(`
    <!doctype html>
<html>
<head>
    <title>Thank you for submitting!</title>
</head>
<body>
  <p>Thank you for submitting.</p>
  ${
    afterSubmit.type === 'STRIPE_CHECKOUT'
      ? `<script src="https://js.stripe.com/v3/"></script>
  <script>
    const stripe = Stripe('${afterSubmit.payload.token}');

    stripe.redirectToCheckout({
      items: ${JSON.stringify(afterSubmit.payload.items)},
      successUrl: '${afterSubmit.payload.successUrl}',
      cancelUrl: '${afterSubmit.payload.cancelUrl}',
      customerEmail: '${body.email}'
    })
  </script>
  <p>You will be redirected shortly...</p>`
      : '<a href="${referrer}">Go back &rarr;</a>'
  }
</body>
</html>
    `)
  } catch (error) {
    console.error(error)
  }
}
