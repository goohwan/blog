import { AppPropsWithLayout } from "../types"
import { Hydrate, QueryClientProvider } from "@tanstack/react-query"
import { RootLayout } from "src/layouts"
import { queryClient } from "src/libs/react-query"
import Script from "next/script"
import { useState, useEffect } from "react" 
import { useTheme } from "next-themes" // (1) 테마를 가져오기 위해 import 합니다.

// (2) 스크롤 진행률을 계산하는 커스텀 Hook (이전과 동일)
const useReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollTop = document.documentElement.scrollTop
      
      const newProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      
      setProgress(newProgress)
    }

    window.addEventListener("scroll", updateScrollProgress)

    return () => {
      window.removeEventListener("scroll", updateScrollProgress)
    }
  }, []) 

  return progress
}

// (3) 진행률 표시줄 컴포넌트
const ReadingProgressBar = () => {
  const completion = useReadingProgress()
  const { theme } = useTheme() // 현재 테마(light/dark)를 가져옵니다.

  // Radix UI Indigo 색상 팔레트에서 테마에 맞는 색상 쉐이드를 지정합니다.
  // 이 값은 colors.ts 파일의 Indigo 계열 색상 중 하나여야 합니다.
  const barColor = theme === 'dark' ? '#9192F8' : '#3E5AFB' // 예: indigo9Dark, indigo11Light에 해당하는 색상 코드를 직접 입력했습니다.

  return (
    <div
      style={{
        position: "fixed", 
        top: 0,
        left: 0,
        width: `${completion}%`, 
        height: "4px", 
        backgroundColor: barColor, // (4) 테마에 따라 색상 적용
        zIndex: 100, 
        transition: "width 0.1s ease-out", 
      }}
    />
  )
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  const ADSENSE_CLIENT_ID = "ca-pub-3474389046240414"

  return (
    <>
      <ReadingProgressBar /> 
      
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