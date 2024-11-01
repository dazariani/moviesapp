import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GlobalStyle } from "./css/globalStyles.ts";

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalStyle />
    <App />
  </>
);
