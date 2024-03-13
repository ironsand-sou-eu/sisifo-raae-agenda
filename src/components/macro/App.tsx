import { useEffect, useState } from "react";
import AnimationsProvider from "../hooks/providers/AnimationsProvider";
import FiltersProvider from "../hooks/providers/FiltersProvider";
import NotificationsProvider from "../hooks/providers/NotificationsProvider";
import TarefasListProvider from "../hooks/providers/TarefasListProvider";
import StartPage from "./pages/StartPage";
import useGoogleConnector from "../hooks/connectors/useGoogleConnector";
import LoginScreen from "./pages/LoginPage";
import "../../assets/styles.css";
import CreateEntitiesProvider from "../hooks/providers/CreateEntitiesProvider";
import TarefaDetailsProvider from "../hooks/providers/TarefaDetailsProvider";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { assessAuthentication } = useGoogleConnector();

  useEffect(() => {
    assessAuthentication(setIsAuthenticated);
  }, []);

  return (
    <AnimationsProvider>
      <NotificationsProvider>
        <FiltersProvider>
          <TarefasListProvider>
            <TarefaDetailsProvider>
              <CreateEntitiesProvider>{isAuthenticated ? <StartPage /> : <LoginScreen />}</CreateEntitiesProvider>
            </TarefaDetailsProvider>
          </TarefasListProvider>
        </FiltersProvider>
      </NotificationsProvider>
    </AnimationsProvider>
  );
}
