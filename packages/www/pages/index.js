import Router from 'next/router'
import Link from 'next/link'
import cookies from 'nookies'
import axios from 'axios'

import DefaultLayout from '../components/default-layout'
import { H1, H2, P } from '../components/typography'
import Button from '../components/button'

import CreateWebsiteIllustration from '../assets/create-website-illustration.svg'

const Dashboard = ({ sites }) => (
  <DefaultLayout
    title="Your sites"
    headerContent={
      <Link href="/logout">
        <a className="ml-4 text-lg text-white">Logout</a>
      </Link>
    }
    mainClassName={sites.length === 0 && 'relative'}
  >
    {sites.length ? (
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
              <Button
                action="secondary"
                className="ml-2"
                href={url}
                openInNewTab
              >
                View site
              </Button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="lg:absolute lg:h-full lg:w-full lg:flex lg:items-center">
        <div className="max-w-xl w-full p-8">
          <div className="max-w-xs mx-auto">
            <H2>Your sites will go here</H2>
            <P className="text-gray-800 mt-4">
              There's no time like the present.
              <br />
              Get started with your first site.
            </P>
            <Link as="/sites/new/builder" href="/builder?siteId=new">
              <Button action="primary" className="mt-6">
                Create a site
              </Button>
            </Link>
          </div>
        </div>
        <CreateWebsiteIllustration className="w-full h-auto max-h-full p-4 sm:p-8" />
      </div>
    )}
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
