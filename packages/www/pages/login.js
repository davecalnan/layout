import { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import cookies from 'nookies'

import DefaultLayout from '../components/default-layout'
import { H1, Label } from '../components/typography'
import { Input } from '../components/form-controls'
import Button from '../components/button'

const LoginForm = ({ className }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState()

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const { data } = await axios.post(`${process.env.API_BASE}/auth/login`, {
        email,
        password
      })
      const { token } = data

      cookies.set(null, 'token', token)

      Router.push('/')
    } catch (error) {
      setError('Your email or password is incorrect.')
    }
  }
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col">
        <Label htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          autoFocus
        />
      </div>
      <div className="flex flex-col mt-8">
        <Label htmlFor="password">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
      </div>
      <Button type="submit" action="primary" className="mt-8 w-full">
        Log in
      </Button>
      <p className="mt-4 -mb-6 text-red-500">{error}</p>
    </form>
  )
}

const LoginPage = () => (
  <DefaultLayout className="bg-gray-100" mainClassName="relative" title="Login">
    <section className="absolute w-full h-full flex justify-end items-center">
      <div className="absolute left-0 p-4 sm:static sm:left-auto sm:p-0">
        <div className="border bg-white px-8 py-12 sm:px-12 md:p-16 lg:p-20 xl:p-24">
          <H1>Welcome back</H1>
          {/* <div className="mt-2 text-sm">
            Don't have an account?
            {' '}
            <Link href="/sites/new/builder">
              <a className="text-blue-500 underline">Start here.</a>
            </Link>
          </div> */}
          <LoginForm className="mt-6" />
        </div>
      </div>
      <div className="h-full w-3/4 sm:w-1/2">
        <img
          className="h-full object-cover bg-black"
          src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
          alt="A top-down view of a laptop, coffee, notebook, and paper"
        />
      </div>
    </section>
  </DefaultLayout>
)

export default LoginPage
