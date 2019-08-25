import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Header = ({ logoUrl, logoSource, links, id, className }) => (
  <header id={id} className={className}>
    <nav className="container">
      <a href={logoUrl}>
        <img src={logoSource} />
      </a>
      <ul>
        {links.map(({ url, text }, index) => (
          <li key={index}>
            <a href={url}>{text}</a>
          </li>
        ))}
      </ul>
    </nav>
  </header>
)

Header.propTypes = {
  logoUrl: PropTypes.string,
  logoSource: PropTypes.string,
  links: PropTypes.array
}

export default styled(Header)`
  ${tw`bg-white text-gray-900 text-sm uppercase tracking-wide p-4`}
  ${({ theme }) => theme.typogaphy.body}

  > nav {
    ${tw`mx-auto flex justify-between items-center`}

    > a {
      > img {
        ${tw`h-12`}
      }
    }

    > ul {
      ${tw`flex items-center`}

      > li {
        &:not(:first-of-type) {
          ${tw`pl-4 border-l`}
        }

        &:not(:last-of-type) {
          ${tw`pr-4`}
        }
      }
    }
  }
`
