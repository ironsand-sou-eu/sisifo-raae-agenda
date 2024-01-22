import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/macro/App";
import AnimationsProvider from "./components/hooks/AnimationsProvider";
import FiltersProvider from "./components/hooks/FiltersProvider";
import TarefasListProvider from "./components/hooks/TarefasListProvider";
import MessagesProvider from "./components/hooks/MessagesProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnimationsProvider>
      <FiltersProvider>
        <TarefasListProvider>
          <MessagesProvider>
            <App />
          </MessagesProvider>
        </TarefasListProvider>
      </FiltersProvider>
    </AnimationsProvider>
  </StrictMode>
);
