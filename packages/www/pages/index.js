import Router from 'next/router'
import Link from 'next/link'
import cookies from 'nookies'
import axios from 'axios'

import DefaultLayout from '../components/default-layout'
import { H2, P } from '../components/typography'
import Button from '../components/button'
import Icon, { ICON_ADD_CIRCLE, ICON_EXTERNAL_WINDOW, ICON_GLOBE } from '../components/icon'

import CreateWebsiteIllustration from '../assets/create-website-illustration.svg'

const Dashboard = ({ sites }) => (
  <DefaultLayout
    headerContent={
      <Link as="/sites/new/builder" href="/builder?siteId=new">
        <button className="flex items-center rounded-full bg-blue-500 font-bold text-white focus:outline-none focus:shadow-outline pl-4 pr-1 py-1">
          Create new site
          <Icon
            type={ICON_ADD_CIRCLE}
            primary="#fff"
            secondary="#2b6cb0"
            className="ml-1 h-6 w-6"
          />
        </button>
      </Link>
    }
    mainClassName={sites.length === 0 && 'relative'}
  >
    {sites.length ? (
      <div className="flex flex-wrap p-8">
        {sites.map(({ id, url, subdomain, domain }) => (
          <div key={id} className="w-80 bg-white rounded-lg shadow-md mr-8">
            <Link as={`/sites/${id}/builder`} href={`/builder?siteId=${id}`}>
              <img
                className="w-80 h-50 rounded-t-lg cursor-pointer bg-gray-100"
                src={`https://api.apiflash.com/v1/urltoimage?access_key=2d674fb464874085b3602e6e64661a95&height=900&thumbnail_width=640&width=1440&&url=${encodeURI(
                  url
                )}`}
                alt={`A preview of ${domain}`}
              />
            </Link>
            <div className="px-4 py-6">
              <div className="flex justify-between">
                <div className="flex items-center font-bold text-base">
                  <Icon type={ICON_GLOBE} className="h-6 w-6 mr-2" />
                  {subdomain || domain}
                </div>
                <span className="rounded-full text-sm font-bold text-green-900 bg-green-200 px-2">
                  Published
                </span>
              </div>
            </div>
            <div className="flex rounded-b-lg border-t bg-gray-100 text-center text-blue-600">
              <Link as={`/sites/${id}/builder`} href={`/builder?siteId=${id}`}>
                <a className="w-1/2 p-2">Edit site</a>
              </Link>
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="w-1/2 flex items-center justify-center p-2 border-l"
              >
                View site
                <Icon
                  type={ICON_EXTERNAL_WINDOW}
                  className="ml-1 h-5 w-5 mb-1"
                />
              </a>
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
