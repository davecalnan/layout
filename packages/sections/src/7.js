import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Services = ({
  asideBackgroundColor,
  servicesBackgroundColor,
  servicesTitle,
  services,
  children,
  id,
  className
}) => (
  <section id={id} className={className}>
    <aside style={{ backgroundColor: asideBackgroundColor }}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { backgroundType: 'dark' })
      )}
    </aside>
    <main style={{ backgroundColor: servicesBackgroundColor }}>
      <h2>{servicesTitle}</h2>
      <div>
        {services.map(({ imageSource, name, description }, index) => (
          <div>
            {imageSource && <img src={imageSource} />}
            <div>
              <h4>{name}</h4>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  </section>
)

Services.propTypes = {
  asideBackgroundColor: PropTypes.string,
  servicesBackgroundColor: PropTypes.string,
  servicesTitle: PropTypes.string,
  services: PropTypes.array
}

export default styled(Services)`
  ${tw`flex mx-auto`}

  > aside {
    ${tw`w-2/5 pt-12 px-8 pb-8`}

    /*
      These left paddings make the section edge line
      up with centered Tailwind containers.
    */
    @media (min-width: 640px) {
      padding-left: calc((100vw - 640px) / 2);
    }

    @media (min-width: 768px) {
      padding-left: calc((100vw - 768px) / 2);
    }

    @media (min-width: 1024px) {
      padding-left: calc((100vw - 1024px) / 2);
    }

    @media (min-width: 1280px) {
      padding-left: calc((100vw - 1280px) / 2);
    }
  }

  > main {
    ${tw`w-3/5 pt-12 px-8 pb-8`}

    /*
      These right paddings make the section edge line
      up with centered Tailwind containers.
    */
    @media (min-width: 640px) {
      padding-right: calc((100vw - 640px) / 2);
    }

    @media (min-width: 768px) {
      padding-right: calc((100vw - 768px) / 2);
    }

    @media (min-width: 1024px) {
      padding-right: calc((100vw - 1024px) / 2);
    }

    @media (min-width: 1280px) {
      padding-right: calc((100vw - 1280px) / 2);
    }

    > h2 {
      ${tw`text-4xl leading-none tracking-tight mb-6`}
      ${({ theme }) => theme.typography.headings}
    }

    > div {
      ${tw`flex flex-wrap`}

      > div {
        ${tw`w-1/2 flex items-start mb-8`}

        &:nth-of-type(2n - 1) {
          ${tw`pr-4`}
        }

        &:nth-of-type(2n) {
          ${tw`pl-4`}
        }

        > img {
          ${tw`w-12 h-auto object-contain mr-4`}
        }

        > div {
          > h4 {
            ${tw`font-normal text-lg leading-none mt-1 mb-2`}
          }

          > p {
            ${tw`text-gray-700`}
          }
        }
      }
    }
  }
`
