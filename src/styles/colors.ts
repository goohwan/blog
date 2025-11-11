import {
  gray,
  blue,
  red,
  green,
  indigo,
  // 💡 light 테마에 추가할 색상 import
  amber, 
  pink,
  purple, 
  
  grayDark,
  blueDark,
  redDark,
  greenDark,
  indigoDark,
  // 💡 dark 테마에 추가할 색상 import
  amberDark,
  pinkDark,
  purpleDark,
} from "@radix-ui/colors"

export type Colors = typeof colors.light & typeof colors.dark

export const colors = {
  light: {
    ...indigo,
    ...gray,
    ...blue,
    ...red,
    ...green,
    // ⭐️ 추가: light 테마에 amber, pink, purple 색상 추가
    ...amber,
    ...pink,
    ...purple,
  },
  dark: {
    ...indigoDark,
    ...grayDark,
    ...blueDark,
    ...redDark,
    ...greenDark,
    // ⭐️ 추가: dark 테마에 amber, pink, purple 색상 추가
    ...amberDark,
    ...pinkDark,
    ...purpleDark,
  },
}