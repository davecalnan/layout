import Router from 'next/router'
import cookies from 'nookies'

export const redirect = ({ ctx = {}, to, statusCode = 302 }) => {
  const { res } = ctx

  if (res) {
    res.writeHead(statusCode, {
      Location: to
    })
    res.end()
  } else {
    Router.push(to)
  }
}

export const redirectIfNotAuthenticated = ctx => {
  const { token } = cookies.get(ctx)

  if (!token) {
    redirect({
      ctx,
      to: '/login'
    })
  }
}