import Link from 'next/link'

import { H3 } from './typography'

const Header = ({ content }) => (
  <header className="flex justify-between items-center bg-blue-500 shadow text-white px-4 py-2">
    <H3>
      <Link href="/">
        <a className="font-black">Builder</a>
      </Link>
    </H3>
    {content}
  </header>
)

export default Header
