import { PropTypes } from '../lib'
import { P } from './typography.demo'

const Footer = ({ copyrightText }) => (
  <footer className="text-center px-8 py-20">
    <P>
      {copyrightText}
      {' '}
      Images:
      {' '}
      <a href="https://unsplash.com" className="underline">Unsplash</a>.
      Design:
      {' '}
      <a href="https://html5up.net" className="underline">HTML5 UP</a>.
    </P>
  </footer>
)

Footer.propTypes = {
  copyrightText: PropTypes.string
}

export default Footer
