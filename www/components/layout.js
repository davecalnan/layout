import '../styles/app.css'
import styled from 'styled-components'
import tw from 'tailwind.macro'

import Header from './header'

const Layout = ({ headerContent, sidebarContent, children, className }) => (
  <div className={className}>
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
  "header header"
  "sidebar main"
  "footer footer";
grid-template-columns: 1fr 3fr;
grid-template-rows: auto 1fr auto;

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
