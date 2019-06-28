import styled from 'styled-components'
import tw from 'tailwind.macro'
import classNames from 'classnames'

export const ICON_ADD = 'ICON_ADD'
export const ICON_CHEVRON_DOWN = 'ICON_CHEVRON_DOWN'
export const ICON_DUPLICATE = 'ICON_DUPLICATE'

const pickIcon = type => {
  switch (type) {
    case 'ICON_ADD': {
      return (
        <path className="primary" fillRule="evenodd" d="M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z" />
      )
    }
    case 'ICON_CHEVRON_DOWN': {
      return (
        <path className="primary" fillRule="evenodd" d="M15.3 10.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z" />
      )
    }
    case 'ICON_DUPLICATE': {
      return (
        <>
          <rect className="secondary" width="14" height="14" x="3" y="3" rx="2"/>
          <rect className="primary" width="14" height="14" x="7" y="7" rx="2"/>
        </>
      )
    }
  }
}

const Icon = ({ type, className }) => (
  <svg
    className={classNames(
      className,
      'fill-current',
      className.split(' ').some(cls => cls.startsWith('w-')) || 'w-8',
      className.split(' ').some(cls => cls.startsWith('h-')) || 'h-8'
    )}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    {pickIcon(type)}
  </svg>
)

export default styled(Icon)`
  .primary {
    ${({ primary }) => primary ? { color: primary } : tw`text-gray-700`}
  }

  .secondary {
   ${({ secondary }) => secondary ? { color: secondary } : tw`text-gray-500`}
  }
`
