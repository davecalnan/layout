import classNames from 'classnames'

import BaseLayout from './base-layout'

const MinimalLayout = ({ children, className, mainClassName }) => (
  <BaseLayout className={classNames(className, 'min-h-screen flex flex-col')}>
    <main className={classNames('flex-1 overflow-y-scroll shadow-inner bg-gray-200', mainClassName)}>
      {children}
    </main>
  </BaseLayout>
)

export default MinimalLayout