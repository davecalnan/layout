import React from 'react'

const Viewer = ({ site }) =>
  site.components
    ? site.components.map((({ id, props }, index) => {
      const Component = React.lazy(() => import(`@layouthq/sections/dist/${id}`))
      return <Component key={index} {...props} />
    }))
    : null

export default Viewer
