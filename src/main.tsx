import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/macro/App";

if (chrome && "sidepanel" in chrome) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
