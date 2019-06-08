import Link from 'next/link'
import Layout from '../components/layout'
import { P } from '../components/typography'

const Homepage = () => (
  <Layout>
    <div className="p-4">
      <P className="mb-4">
        Wow, this page is incredibly empty.
      </P>
      <Link href="/sites/1066427/builder">
        <a className="text-lg underline text-blue-500">Click here to see the proof of concept &rarr;</a>
      </Link>
    </div>
  </Layout>
)

export default Homepage
