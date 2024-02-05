import { useEffect, useState } from "react";
import AnimationsProvider from "../hooks/AnimationsProvider";
import FiltersProvider from "../hooks/FiltersProvider";
import NotificationsProvider from "../hooks/NotificationsProvider";
import TarefasListProvider from "../hooks/TarefasListProvider";
import StartScreen from "./StartScreen";
import useGoogleConnector from "../hooks/useGoogleConnector";
import LoginScreen from "./LoginScreen";
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
          <NotificationsProvider>{isAuthenticated ? <StartScreen /> : <LoginScreen />}</NotificationsProvider>
        </TarefasListProvider>
      </FiltersProvider>
    </AnimationsProvider>
  );
}
