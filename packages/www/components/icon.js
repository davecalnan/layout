import styled from 'styled-components'
import tw from 'tailwind.macro'
import classNames from 'classnames'

export const ICON_ADD = 'ICON_ADD'
export const ICON_CHEVRON_DOWN = 'ICON_CHEVRON_DOWN'
export const ICON_CHEVRON_LEFT = 'ICON_CHEVRON_LEFT'
export const ICON_CHEVRON_RIGHT = 'ICON_CHEVRON_RIGHT'
export const ICON_DOTS_VERTICAL_DOUBLE = 'ICON_DOTS_VERTICAL_DOUBLE'
export const ICON_DUPLICATE = 'ICON_DUPLICATE'
export const ICON_EXTERNAL_WINDOW = 'ICON_EXTERNAL_WINDOW'
export const ICON_TRASH = 'ICON_TRASH'

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
    case 'ICON_CHEVRON_LEFT': {
      return (
        <path className="primary" d="M13.7 15.3a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 1.4L10.42 12l3.3 3.3z" />
      )
    }
    case 'ICON_CHEVRON_RIGHT': {
      return (
        <path className="primary" d="M10.3 8.7a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l3.29-3.3-3.3-3.3z" />
      )
    }
    case 'ICON_DOTS_VERTICAL_DOUBLE': {
      return (
        <>
          <path d="M8.55,7a2,2,0,1,1,2-2A2,2,0,0,1,8.55,7Zm0,7a2,2,0,1,1,2-2A2,2,0,0,1,8.55,14Zm0,7a2,2,0,1,1,2-2A2,2,0,0,1,8.55,21Z" />
          <path d="M15.45,7a2,2,0,1,1,2-2A2,2,0,0,1,15.45,7Zm0,7a2,2,0,1,1,2-2A2,2,0,0,1,15.45,14Zm0,7a2,2,0,1,1,2-2A2,2,0,0,1,15.45,21Z" />
        </>
      )
    }
    case 'ICON_DUPLICATE': {
      return (
        <>
          <rect className="secondary" width="14" height="14" x="3" y="3" rx="2" />
          <rect className="primary" width="14" height="14" x="7" y="7" rx="2" />
        </>
      )
    }
    case 'ICON_EXTERNAL_WINDOW': {
      return (
        <>
          <path className="primary" d="M12 8a1 1 0 0 1-1 1H5v10h10v-6a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h6a1 1 0 0 1 1 1z" />
          <path className="secondary" d="M19 6.41L8.7 16.71a1 1 0 1 1-1.4-1.42L17.58 5H14a1 1 0 0 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V6.41z" />
        </>
      )
    }
    case 'ICON_TRASH': {
      return (
        <>
          <path className="primary" d="M5 5h14l-.89 15.12a2 2 0 0 1-2 1.88H7.9a2 2 0 0 1-2-1.88L5 5zm5 5a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0-1-1z" />
          <path className="secondary" d="M8.59 4l1.7-1.7A1 1 0 0 1 11 2h2a1 1 0 0 1 .7.3L15.42 4H19a1 1 0 0 1 0 2H5a1 1 0 1 1 0-2h3.59z" />
        </>
      )
    }
  }
}

const Icon = ({ type, className, style }) => (
  <svg
    className={classNames(
      className,
      'fill-current',
      className.split(' ').some(cls => cls.startsWith('w-')) || 'w-8',
      className.split(' ').some(cls => cls.startsWith('h-')) || 'h-8'
    )}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    {pickIcon(type)}
  </svg>
)

export default styled(Icon)`
  .primary {
    ${({ disabled, primary, className }) =>
      disabled
        ? tw`text-gray-400`
        : primary
        ? { color: primary }
        : tw`text-gray-700`
        ? className && className.split(' ').some(cls => cls.startsWith('text-'))
        : null
    }
  }

  .secondary {
    ${({ disabled, primary }) =>
      disabled
        ? tw`text-gray-200`
        : primary
        ? { color: primary }
        : tw`text-gray-500`}
  }
`
