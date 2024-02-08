import { useEffect, useState } from "react";
import AnimationsProvider from "../hooks/AnimationsProvider";
import FiltersProvider from "../hooks/FiltersProvider";
import NotificationsProvider from "../hooks/NotificationsProvider";
import TarefasListProvider from "../hooks/TarefasListProvider";
import StartPage from "./pages/StartPage";
import useGoogleConnector from "../hooks/useGoogleConnector";
import LoginScreen from "./pages/LoginPage";
import "../../styles.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { assessAuthentication } = useGoogleConnector();

  useEffect(() => {
    assessAuthentication(setIsAuthenticated);
  }, []);

  return (
    <AnimationsProvider>
      <FiltersProvider>
        <TarefasListProvider>
          <NotificationsProvider>{isAuthenticated ? <StartPage /> : <LoginScreen />}</NotificationsProvider>
        </TarefasListProvider>
      </FiltersProvider>
    </AnimationsProvider>
  );
}
