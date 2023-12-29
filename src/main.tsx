import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/macro/App";
import FilterAnimationsProvider from "./components/hooks/FilterAnimationsProvider";
import FiltersProvider from "./components/hooks/FiltersProvider";
import LoadingProvider from "./components/hooks/LoadingProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FilterAnimationsProvider>
      <FiltersProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </FiltersProvider>
    </FilterAnimationsProvider>
  </React.StrictMode>
);
