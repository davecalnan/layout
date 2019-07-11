import classNames from 'classnames'

import BaseLayout from './base-layout'
import Header from './header'

const DefaultLayout = ({ headerContent, children, className, mainClassName }) => (
  <BaseLayout className={classNames(className, 'min-h-screen flex flex-col')}>
    <Header content={headerContent} />
    <main className={classNames('flex-1 overflow-y-scroll shadow-inner bg-gray-200', mainClassName)}>
      {children}
    </main>
  </BaseLayout>
)

export default DefaultLayout