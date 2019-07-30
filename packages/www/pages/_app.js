import App, { Container } from 'next/app'
import cookies from 'nookies'
import axios from 'axios'
import Intercom from 'react-intercom'

const getUser = async token => {
  try {
    const { data: user } = await axios.get(`${process.env.API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return user
  } catch (error) {
    return {}
  }
}

export default class CustomApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const { token } = cookies.get(ctx)

    const user = await getUser(token)

    return { pageProps, token, user }
  }

  render() {
    const { Component, pageProps, user } = this.props

    return (
      <Container>
        <Component {...pageProps} />
        <Intercom
          appID="wevtwanr"
          user_id={user.id}
          email={user.email}
          name={user.name}
        />
      </Container>
    )
  }
}
