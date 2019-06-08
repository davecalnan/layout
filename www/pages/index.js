import Link from 'next/link'
import Layout from '../components/layout'

const Homepage = () => (
  <Layout>
    <div className="p-4">
      <Link href="/sites/1066427/builder">
        <a className="text-lg underline text-blue-500">Example</a>
      </Link>
    </div>
  </Layout>
)

export default Homepage
