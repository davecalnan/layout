import Router from 'next/router'
import Link from 'next/link'
import cookies from 'nookies'
import axios from 'axios'

import DefaultLayout from '../components/default-layout'
import { H2, P } from '../components/typography'
import Button from '../components/button'

const Dashboard = ({ sites }) => (
  <DefaultLayout
    title="Your sites"
    headerContent={
      <Link href="/logout">
        <a className="ml-4 text-lg text-white">Logout</a>
      </Link>
    }
  >
    <div className="flex flex-wrap p-8">
      {sites.map(({ id, url, domain }) => (
        <div key={id} className="w-80 bg-white rounded shadow-md mr-8">
          <Link as={`/sites/${id}/builder`} href={`/builder?siteId=${id}`}>
            <img
              className="w-80 h-50 rounded-t cursor-pointer"
              src={`https://api.apiflash.com/v1/urltoimage?access_key=2d674fb464874085b3602e6e64661a95&height=900&thumbnail_width=640&width=1440&&url=${encodeURI(
                url
              )}`}
              alt={`A preview of ${domain}`}
            />
          </Link>
          <div className="p-4">
            <P>{domain}</P>
            <Link as={`/sites/${id}/builder`} href={`/builder?siteId=${id}`}>
              <Button action="primary" className="mt-2">
                Edit site
              </Button>
            </Link>
            <Button action="secondary" className="ml-2" href={url} openInNewTab>
              View site
            </Button>
          </div>
        </div>
      ))}
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
