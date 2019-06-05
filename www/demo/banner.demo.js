import { PropTypes } from '../../lib'

import { H1, P } from './typography.demo'
import Button from './button.demo'

const Banner = ({ heading, text, buttonText, buttonPath, imageSource, imagePosition }) => (
  <section className={[
    'w-full h-screen flex border-b border-gray-200',
    imagePosition === 'left' ? 'flex-row-reverse' : 'flex-row'
  ].join(' ')}>
    <div className="w-1/2 h-full flex flex-col justify-center">
      <div className="p-12">
        <H1 className="mb-6">{heading}</H1>
        <P className="mb-6">{text}</P>
        <Button href={buttonPath}>{buttonText}</Button>
      </div>
    </div>
    <div
      style={{ backgroundImage: `url(${imageSource})` }}
      className="w-1/2 h-full bg-cover bg-center bg-gray-300"
    />
  </section>
)

Banner.propTypes = {
  heading: PropTypes.string,
  text: PropTypes.text,
  buttonText: PropTypes.string,
  buttonPath: PropTypes.string,
  imageSource: PropTypes.string,
  imagePosition: PropTypes.list(['left', 'right'])
}

Banner.defaultProps = {
  imagePosition: 'right'
}

export default Banner
