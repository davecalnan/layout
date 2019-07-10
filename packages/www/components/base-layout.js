import '../styles/app.css'

import PreviewReleaseWarning from './preview-release-warning'

const BaseLayout = ({ children, className }) => (
  <div className={className}>
    <PreviewReleaseWarning />
    {children}
  </div>
)

export default BaseLayout
