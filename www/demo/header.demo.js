import { PropTypes } from '../../lib'

const Header = ({ title }) => (
  <header
    style={{
      background: 'red',
      width: '100%'
    }}
  >
    {title}
  </header>
)

Header.propTypes = {
  title: PropTypes.string
}

export default Header
