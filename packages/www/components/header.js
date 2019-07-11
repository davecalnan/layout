import Link from 'next/link'

import { H1 } from './typography'
import Logo from '../assets/layout-logo-color.svg'

const Header = ({ title, content }) => (
  <header className="flex justify-between items-center text-blue-900 border-b border-gray-400 bg-white px-4 py-2">
    <div className="max-w-xs w-full">
      <Link href="/">
        <Logo className="h-8 cursor-pointer" />
      </Link>
    </div>
    <div className="flex text-sm font-bold">
      <Link href="/">
        <a>Dashboard</a>
      </Link>
      <Link href="/logout">
        <a className="ml-4">Logout</a>
      </Link>
    </div>
    <div className="max-w-xs w-full flex justify-end">{content}</div>
  </header>
)

export default Header
