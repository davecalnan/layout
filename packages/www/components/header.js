import Link from 'next/link'

import { H1 } from './typography'
import Logo from '../assets/layout-logo.svg'

const Header = ({ title, content }) => (
  <header className="flex justify-between items-center bg-blue-500 shadow text-white px-4 py-2">
    <H1 className="flex">
      <Link href="/">
        <a className="flex font-black text-white">
          <Logo className="fill-current h-8 mr-2" />
        </a>
      </Link>
      {title && (
        <>
          <span className="font-light mr-2">/</span>
          {title}
        </>
      )}
    </H1>
    {content}
  </header>
)

export default Header
