import Router from 'next/router'
import Link from 'next/link'
import cookies from 'nookies'
import axios from 'axios'

import DefaultLayout from '../components/default-layout'
import { H2 } from '../components/typography'

const Dashboard = ({ sites }) => (
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
      <ul>
        {sites.map(({ id, domain }) => (
          <li className="mb-4">
            <Link as={`/sites/${id}/builder`} href={`/builder?siteId=${id}`}>
              <a className="text-lg text-blue-500 underline">{domain} &rarr;</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </DefaultLayout>
)

Dashboard.getInitialProps = async ctx => {
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
    return {}
  }

  const { data } = await axios.get(`${process.env.API_BASE}/users/me/sites`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return { sites: data.data }
}

export default Dashboard
