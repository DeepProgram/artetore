import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&amp;display=swap" />
      </Head>
      <body>
        <div id='modal-root' />
        <div id='backdrop-root' />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
