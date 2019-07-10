import Router from 'next/router'
import cookies from 'nookies'

const LogoutPage = () => {}

LogoutPage.getInitialProps = ctx => {
  const { res } = ctx
  cookies.destroy(ctx, 'token')

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

export default LogoutPage
