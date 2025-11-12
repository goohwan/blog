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
      // documentElement를 사용하면 body나 html의 높이를 정확히 파악
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollTop = document.documentElement.scrollTop
      
      const newProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      
      setProgress(newProgress)
    }

    window.addEventListener("scroll", updateScrollProgress)
    // 초기에 한 번 실행하여 상태 설정
    updateScrollProgress(); 

    return () => {
      window.removeEventListener("scroll", updateScrollProgress)
    }
  }, []) 

  return progress
}

// (2) 진행률 표시줄 컴포넌트
const ReadingProgressBar = () => {
  const completion = useReadingProgress()
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  // ⭐️ 테마 상태를 감지하는 useEffect
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // <html> 태그의 data-theme 속성을 확인
      const currentTheme = document.documentElement.getAttribute('data-theme')
      setIsDarkTheme(currentTheme === 'dark')
    })

    // <html> 태그의 속성 변경 감시 시작
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // 컴포넌트 마운트 시 초기 테마 설정
    const initialTheme = document.documentElement.getAttribute('data-theme')
    setIsDarkTheme(initialTheme === 'dark')

    return () => {
      observer.disconnect()
    }
  }, [])

  // ⭐️ 테마에 따라 대비되는 색상 변수를 설정
  // 라이트 테마(배경 밝음): 진한 남색 계열 변수 사용
  // 다크 테마(배경 어두움): 밝은 남색 계열 변수 사용
  // 아래 변수들은 colors.ts에 정의된 Radix UI의 Indigo 계열 변수여야 합니다.
  const barColorCSSVar = isDarkTheme 
    ? 'var(--colors-indigo9Dark)' // 다크 모드에서는 밝은 계열 색상을 사용
    : 'var(--colors-indigo11)'    // 라이트 모드에서는 진한 계열 색상을 사용
  
  return (
    <div
      style={{
        position: "fixed", 
        top: "48px", 
        left: 0,
        width: `${completion}%`, 
        height: "4px", 
        backgroundColor: barColorCSSVar, // ⭐️ 테마별 변수 적용
        display:"inline",
        zIndex: 100, 
        transition: "width 0.1s ease-out", 
      }}
    />
  )
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  // ... (나머지 App 컴포넌트 내용은 동일)
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