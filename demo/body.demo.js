import { PropTypes } from '../lib'

const Body = ({ content }) => (
  <div>
    {content}
  </div>
)

Body.propTypes = {
  content: PropTypes.text
}

export default Body
