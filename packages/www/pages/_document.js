import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const { renderPage } = ctx

    const sheet = new ServerStyleSheet()

    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )

    const styleTags = sheet.getStyleElement()

    return { ...page, styleTags }
  }

  render() {
    const { styleTags } = this.props

    return (
      <Html>
        <Head>{styleTags}</Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
