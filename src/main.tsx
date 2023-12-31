import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/macro/App";
import FilterAnimationsProvider from "./components/hooks/FilterAnimationsProvider";
import FiltersProvider from "./components/hooks/FiltersProvider";
import TarefasListProvider from "./components/hooks/TarefasListProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FilterAnimationsProvider>
      <FiltersProvider>
        <TarefasListProvider>
          <App />
        </TarefasListProvider>
      </FiltersProvider>
    </FilterAnimationsProvider>
  </StrictMode>
);
