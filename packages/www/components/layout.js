import '../styles/app.css'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import Header from './header'
import { P } from './typography'

const Layout = ({ headerContent, sidebarContent, children, className }) => (
  <div className={className}>
    <div className="w-full text-center bg-yellow-200">
      <P>
        <span className="text-base">
          🚧 Please note this is an early preview release and is definitely full of bugs! 🚧
        </span>
      </P>
    </div>
    <Header content={headerContent} />
    <aside className="min-w-xs overflow-x-hidden overflow-y-scroll bg-gray-100 shadow shadow-inner">
      {sidebarContent}
    </aside>
    <main className="overflow-y-scroll shadow-inner">{children}</main>
  </div>
)

export default styled(Layout)`
${tw`h-screen`}
display: grid;
grid-template-areas:
  "banner banner"
  "header header"
  "sidebar main"
  "footer footer";
grid-template-columns: 1fr 3fr;
grid-template-rows: auto auto 1fr auto;

  & > div {
    grid-area: banner;
  }

  & > header {
    grid-area: header;
  }

  & > aside {
    grid-area: sidebar;
  }

  & > main {
    grid-area: main;
  }

  & > footer {
    grid-area: footer;
  }
`
