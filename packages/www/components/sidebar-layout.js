import styled from 'styled-components'
import tw from 'tailwind.macro'

import BaseLayout from './base-layout'
import Header from './header'

const SidebarLayout = ({ title, headerContent, sidebarContent, children, className }) => (
  <BaseLayout className={className}>
    <Header title={title} content={headerContent} />
    <aside className="min-w-xs overflow-x-hidden overflow-y-scroll bg-gray-100 shadow z-10">
      {sidebarContent}
    </aside>
    <main className="overflow-y-scroll shadow-inner">{children}</main>
  </BaseLayout>
)

export default styled(SidebarLayout)`
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
