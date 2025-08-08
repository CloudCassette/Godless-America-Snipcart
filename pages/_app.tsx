import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { AuthProvider } from '@/lib/auth'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>Godless America - Premium E-commerce</title>
        <meta name="description" content="Premium e-commerce platform with Snipcart" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Snipcart Styles */}
        <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.css" />
        
        {/* Dark Theme CSS */}
        <link rel="stylesheet" href="/dark-theme.css" />
      </Head>

      {/* Snipcart Configuration */}
      <div
        hidden
        id="snipcart"
        data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY}
        data-config-modal-style="side"
        data-config-add-product-behavior="none"
      />

      <Component {...pageProps} />

      {/* Snipcart Script */}
      <Script
        src="https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.js"
        strategy="afterInteractive"
      />
    </AuthProvider>
  )
}
