// import '../styles/app.css'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import { P } from '../components/typography'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()

    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />),
    )

    const styleTags = sheet.getStyleElement()

    return { ...page, styleTags }
  }

  render() {
    return (
      <html>
        <Head>{this.props.styleTags}</Head>
        <body className="antialiased">
          <div className="w-full text-center bg-yellow-200">
            <P>
              <span className="text-base">
                🚧 Please note this is an early preview release and
                definitely full of bugs! 🚧
              </span>
            </P>
          </div>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}