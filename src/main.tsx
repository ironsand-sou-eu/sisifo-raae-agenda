import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/macro/App";
import AnimationsProvider from "./components/hooks/AnimationsProvider";
import FiltersProvider from "./components/hooks/FiltersProvider";
import TarefasListProvider from "./components/hooks/TarefasListProvider";
import NotificationsProvider from "./components/hooks/NotificationsProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnimationsProvider>
      <FiltersProvider>
        <TarefasListProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </TarefasListProvider>
      </FiltersProvider>
    </AnimationsProvider>
  </StrictMode>
);
