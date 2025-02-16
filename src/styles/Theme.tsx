import { DefaultTheme, css } from "styled-components";
import "./font.css";

export const Theme: DefaultTheme = {
  fonts: {
    logo: css`
      font-family: "ghanachoco";
      font-size: 25px;
      color: #00517d;
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
    gray: "#E0E0E0",
    gray2: "#F7F7F7",
    black: "#000",
    navy: "#00517d;",
    pointBlue: "#89D5FF",
    blue: "#B5E6FF",
    skyblue: "#D2F0FF",
    lightBlue: "#F0FAFF",
    whiteBlue: "#F9FDFF",
  },
};
