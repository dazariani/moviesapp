import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
body{
  font-family: "Roboto", sans-serif;
  background-color: rgb(16 20 30 / 92%);
  color: aliceblue;

}
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;
