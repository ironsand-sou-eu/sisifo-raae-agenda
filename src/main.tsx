import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/macro/App";
import FilterAnimationsProvider from "./components/hooks/FilterAnimationsProvider";
import FiltersProvider from "./components/hooks/FiltersProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FilterAnimationsProvider>
      <FiltersProvider>
        <App />
      </FiltersProvider>
    </FilterAnimationsProvider>
  </React.StrictMode>
);
