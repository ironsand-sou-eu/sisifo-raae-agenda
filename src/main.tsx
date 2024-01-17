import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/macro/App";
import AnimationsProvider from "./components/hooks/AnimationsProvider";
import FiltersProvider from "./components/hooks/FiltersProvider";
import TarefasListProvider from "./components/hooks/TarefasListProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnimationsProvider>
      <FiltersProvider>
        <TarefasListProvider>
          <App />
        </TarefasListProvider>
      </FiltersProvider>
    </AnimationsProvider>
  </StrictMode>
);
