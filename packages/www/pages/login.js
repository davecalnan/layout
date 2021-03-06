import { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import cookies from 'nookies'
import classNames from 'classnames'

import MinimalLayout from '../components/minimal-layout'
import SEO from '../components/seo'
import { H1, Label } from '../components/typography'
import { Input } from '../components/form-controls'
import LoadingSpinner from '../components/loading-spinner'

import Logo from '../assets/layout-logo-color.svg'

const LoginForm = ({ className }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const handleSubmit = async event => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await axios.post(`${process.env.API_BASE}/auth/login`, {
        email,
        password
      })
      const { token } = data

      cookies.set(null, 'token', token, {
        path: '/'
      })

      Router.push('/')
    } catch (error) {
      setIsLoading(false)
      setError('Your email or password is incorrect.')
    }
  }
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          autoFocus
        />
      </div>
      <div className="flex flex-col mt-8">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
      </div>
      <button
        type="submit"
        className={classNames(
          'mt-8 w-full inline-flex justify-center items-center rounded shadow text-center text-lg text-white py-1',
          isLoading ? 'bg-blue-400' : 'bg-blue-600'
        )}
        disabled={isLoading}
      >
        Log in
        {isLoading && <LoadingSpinner className="ml-2" />}
      </button>
      <p className="mt-4 -mb-6 text-red-500">{error}</p>
    </form>
  )
}

const LoginPage = () => (
  <MinimalLayout mainClassName="relative">
    <SEO title="Login" />
    <section className="absolute w-full h-full flex justify-end items-center">
      <div className="absolute left-0 p-4 sm:static sm:left-auto sm:p-0">
        <div className="border bg-white rounded-lg px-8 py-12 sm:rounded-r-none sm:px-12 md:p-16 lg:p-20 xl:p-24">
          <div className="flex items-center">
            <Logo className="h-8 w-8" />
            <span className="ml-2 text-2xl font-black text-blue-900">Layout</span>
          </div>
          <H1 className="mt-8">Welcome back</H1>
          <div className="mt-2 text-sm">
            Don't have an account?
            {' '}
            <Link href="/sites/new/builder">
              <a className="text-blue-500 underline">Start here.</a>
            </Link>
          </div>
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
  </MinimalLayout>
)

LoginPage.getInitialProps = ctx => {
  const { res } = ctx
  const { token } = cookies.get(ctx)

  if (token) {
    if (res) {
      res.writeHead(204, {
        Location: '/'
      })
      res.end()
    } else {
      Router.push('/')
    }

    return {}
  }
  return {}
}

export default LoginPage
