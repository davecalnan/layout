import classNames from 'classnames'

import BaseLayout from './base-layout'
import Header from './header'

const DefaultLayout = ({ title, headerContent, children, className, mainClassName }) => (
  <BaseLayout className={classNames(className, 'min-h-screen flex flex-col')}>
    <Header title={title} content={headerContent} />
    <main className={classNames('flex-1 overflow-y-scroll shadow-inner bg-gray-100', mainClassName)}>
      {children}
    </main>
  </BaseLayout>
)

export default DefaultLayout