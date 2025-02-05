import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    fonts: {
      [key: string]: ReturnType<typeof css>;
    };
    colors: {
      [key: string]: string;
    };
  }
}
