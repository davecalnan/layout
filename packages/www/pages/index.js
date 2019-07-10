import Router from 'next/router'
import Link from 'next/link'
import cookies from 'nookies'

import DefaultLayout from '../components/default-layout'
import { H2 } from '../components/typography'

const Dashboard = () => (
  <DefaultLayout
    title="Dashboard"
    headerContent={
      <Link href="/logout">
        <a className="ml-4 text-lg text-white">Logout</a>
      </Link>
    }
  >
    <div className="p-8">
      <H2 className="mb-4">Your sites</H2>
      <Link as="/sites/1/builder" href="/builder?siteId=1">
        <a className="text-lg text-blue-500 underline">
          Go to your site &rarr;
        </a>
      </Link>
    </div>
  </DefaultLayout>
)

Dashboard.getInitialProps = ctx => {
  const { res } = ctx
  const { token } = cookies.get(ctx)

  if (!token) {
    if (res) {
      res.writeHead(302, {
        Location: '/login'
      })
      res.end()
    } else {
      Router.push('/login')
    }
  }

  return {}
}

export default Dashboard
