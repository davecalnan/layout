import { useState } from 'react'
import axios from 'axios'
import cookies from 'nookies'

import { H2, Label } from '../typography'
import { Input } from '../form-controls'
import Button from '../button'

const Signup = ({ onComplete }) => {
  const [email, setEmail] = useState('1@onlayout.co')
  const [password, setPassword] = useState('password')

  const handleSubmit = async event => {
    event.preventDefault()

    await axios.post(`${process.env.API_BASE}/users`, {
      email,
      password
    })

    const { data } = await axios.post(`${process.env.API_BASE}/auth/login`, {
      email,
      password
    })
    const { token } = data

    cookies.set(null, 'token', token, {
      path: '/'
    })

    onComplete(token)
  }

  return (
    <>
      <H2 className="mb-4">Create an account</H2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-6">
          <Label>Your email</Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mb-6">
          <Label>Set a password</Label>
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />
        </div>
        <Button action="primary" type="submit">Create account</Button>
      </form>
    </>
  )
}

export default Signup