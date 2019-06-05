import React from 'react'

const Viewer = ({ composition }) =>
  composition.map((({ name, props }, index) => {
    const Component = React.lazy(() => import(`${__dirname}/../../components/dist/${name}.demo`))
    return <Component key={index} {...props} />
  }))

export default Viewer
