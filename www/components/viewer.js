import React from 'react'

const Viewer = ({ site }) =>
  site.components
    ? site.components.map((({ name, props }, index) => {
      const Component = React.lazy(() => import(`${__dirname}/../../components/dist/${name}.demo`))
      return <Component key={index} {...props} />
    }))
    : null

export default Viewer
