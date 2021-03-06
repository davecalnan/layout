import '../styles/app.css'

const BaseLayout = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
)

export default BaseLayout
