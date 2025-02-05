import { DefaultTheme, css } from "styled-components";

export const Theme: DefaultTheme = {
  fonts: {
    logo: css`
      font-family: "";
      font-size: 30px;
    `,
    default: css`
      font-family: "";
      font-size: 20px;
    `,
    title: css`
      font-family: "";
      font-style: normal;
      font-size: 54px;
    `,
    other: css`
      font-family: "";
      font-weight: 300;
      font-style: normal;
    `,
  },
  colors: {
    white: "#fff",
    gray: "#9A9A9A",
    gray2: "#E9E9E9",
    black: "#000",
    red: "#FF4040",
  },
};
