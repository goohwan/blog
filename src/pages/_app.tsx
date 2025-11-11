import { AppPropsWithLayout } from "../types"
import { Hydrate, QueryClientProvider } from "@tanstack/react-query"
import { RootLayout } from "src/layouts"
import { queryClient } from "src/libs/react-query"
// next/script를 import 합니다.
import Script from "next/script"

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  // Google AdSense Publisher ID를 여기에 넣어주세요.
  // 사용자가 제공한 코드: ca-pub-3474389046240414
  const ADSENSE_CLIENT_ID = "ca-pub-3474389046240414"

  return (
    <>
      {/* Google AdSense 스크립트를 Head에 추가합니다. */}
      {/* strategy="afterInteractive"는 페이지 콘텐츠가 표시된 후에 스크립트를 로드하여 성능에 미치는 영향을 최소화합니다. */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default App