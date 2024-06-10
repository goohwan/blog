import { colors } from "../styles/colors" // ⭐️ 추가된 부분: 색상 정의 import
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"

// ⭐️ 추가된 부분: 태그 색상에 사용할 배열 정의
const colorArray = [
  colors.light.red4,
  colors.light.amber4,
  colors.light.green4,
  colors.light.blue4,
  colors.light.indigo4,
  colors.light.purple4,
  colors.light.pink4,
]

type Props = {
  children: string
}

// ⭐️ PR에서 가져온 부분: 문자열 해시를 기반으로 색상을 선택하는 함수
const hashStringToColor = (str: string, colorsArray: string[]) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colorsArray.length

  return colorsArray[index]
}

// ⭐️ Tag 컴포넌트: 단순화하고 Styled 컴포넌트에 props 전달
const Tag: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  const handleClick = (value: string) => {
    router.push(`/?tag=${value}`)
  }

  // StyledTag에 children 값을 tagValue prop으로 전달
  return (
    <StyledTag onClick={() => handleClick(children)} tagValue={children}>
      {children}
    </StyledTag>
  )
}

export default Tag

// ⭐️ Styled 컴포넌트 정의를 Tag 함수 밖으로 이동 (성능 최적화)
// tagValue prop을 받기 위해 제네릭을 사용합니다.
const StyledTag = styled.div<{ tagValue: string }>`
  /* tagValue prop을 받아 hashStringToColor 함수로 배경색을 설정 */
  background-color: ${(props) => hashStringToColor(props.tagValue, colorArray)};
  color: ${colors.light.gray10};
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  cursor: pointer;
`