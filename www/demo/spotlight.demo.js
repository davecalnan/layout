import { PropTypes } from '../../lib'

import { H2, P } from './typography.demo'
import Button from './button.demo'

const Spotlight = ({ heading, text, buttonText, buttonPath, imageSource, imagePosition ='left' }) => (
  <section className={[
    'w-full flex border-b border-gray-200',
    imagePosition === 'left' ? 'flex-row-reverse' : 'flex-row'
  ].join(' ')}>
    <div className="w-2/3 h-full flex flex-col justify-center">
      <div className="pt-20 pr-20 pb-12 pl-20">
        <H2 className="mb-6">{heading}</H2>
        <P className="mb-6">{text}</P>
        <Button href={buttonPath}>{buttonText}</Button>
      </div>
    </div>
    <div
      style={{
        backgroundImage: `url(${imageSource})`,
        minWidth: '20rem'
      }}
      className="w-1/3 h-auto bg-cover bg-center bg-grey-300"
    />
  </section>
)

Spotlight.propTypes = {
  heading: PropTypes.string,
  text: PropTypes.text,
  buttonText: PropTypes.string,
  buttonPath: PropTypes.string,
  imageSource: PropTypes.string,
  imagePosition: PropTypes.list(['left', 'right'])
}

Spotlight.defaultProps = {
  imagePosition: 'left'
}

export default Spotlight
