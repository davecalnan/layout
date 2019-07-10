import bcrypt from 'bcrypt'

export default async ({ db, body }, res) => {
  try {
    const { email, password } = body

    const users = await db.collection('users')
    const user = await users.findOne({ email })

    const credentialsAreValid = user && await bcrypt.compare(password, user.password)

    if (credentialsAreValid) {
      const tokens = await db.collection('tokens')
      const { token } = await tokens.findOne({ userId: user.id })
      return res.status(200).send(JSON.stringify({ token }))
    }

    res.status(401).send(JSON.stringify({
      message: `Invalid credentials provided.`
    }))
  } catch (error) {
    console.error(`Could not log user in: ${error.message}`)
    res.status(500).send(JSON.stringify({
      message: `We couldn't log you in.`
    }))
  }
}
