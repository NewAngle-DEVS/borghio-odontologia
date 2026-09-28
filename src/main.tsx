import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root")!;
const fallback = document.getElementById("boot-fallback");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

if (fallback) {
  const observer = new MutationObserver(() => {
    if (rootElement.childElementCount > 0) {
      fallback.hidden = true;
      observer.disconnect();
    }
  });
  observer.observe(rootElement, { childList: true });
  if (rootElement.childElementCount > 0) {
    fallback.hidden = true;
    observer.disconnect();
  }
}
