import Link from 'next/link'
import Layout from '../components/layout'

const Homepage = () => (
  <Layout>
    <Link
      href="/preview"
    >
      <a className="underline text-blue-500">
        Preview
      </a>
    </Link>
  </Layout>
)

export default Homepage
