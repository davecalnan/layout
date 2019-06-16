import Link from 'next/link'

import { H1 } from './typography'

const Header = ({ content }) => (
  <header className="flex justify-between items-center bg-blue-500 shadow text-white px-4 py-2">
    <H1>
      <Link href="/">
        <a className="font-black">Builder</a>
      </Link>
    </H1>
    {content}
  </header>
)

export default Header
