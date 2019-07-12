import { Helmet } from 'react-helmet'

const SEO = ({ title, description}) => (
  <Helmet title={title} titleTemplate="%s | Layout">
    <meta name="description" content={description} />
  </Helmet>
)

export default SEO
