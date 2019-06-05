import React from 'react'

const Viewer = ({ composition }) =>
  composition.map((({ name, props }, index) => {
    const Component = React.lazy(() => import(`../../demo/${name}.demo`))
    return <Component key={index} {...props} />
  }))

export default Viewer
