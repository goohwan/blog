import { AppPropsWithLayout } from "../types"
import { Hydrate, QueryClientProvider } from "@tanstack/react-query"
import { RootLayout } from "src/layouts"
import { queryClient } from "src/libs/react-query"
import Script from "next/script"
import { useState, useEffect } from "react" 

// (1) 스크롤 진행률을 계산하는 커스텀 Hook (이전과 동일)
const useReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollTop = document.documentElement.scrollTop
      
      const newProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      
      setProgress(newProgress)
    }

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", updateScrollProgress)

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("scroll", updateScrollProgress)
    }
  }, []) 

  return progress
}

// (2) 진행률 표시줄 컴포넌트
const ReadingProgressBar = () => {
  const completion = useReadingProgress()

  // ⭐️ 핵심 변경: CSS 변수 사용
  // 테마에 따라 색상이 자동으로 바뀌는 CSS 변수를 사용합니다.
  // 이 변수가 Indigo11 쉐이드를 나타낸다고 가정합니다.
  const barColorCSSVar = 'var(--colors-indigo11)' 
  
  // 만약 테마 전환 시 가장 잘 보이는 대비되는 색상 코드가 있다면 
  // 다른 변수를 사용하거나, 프로젝트의 메인 색상 변수를 확인해주세요.
  // 예: var(--color-text-highlight) 등

  return (
    <div
      style={{
        position: "fixed", 
        top: 0,
        left: 0,
        width: `${completion}%`, 
        height: "4px", 
        backgroundColor: barColorCSSVar, // (3) CSS 변수 적용
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