import { Dispatch, SetStateAction } from "react";

export default function useGoogleConnector() {
  async function assessAuthentication(setIsAuthenticated: Dispatch<SetStateAction<boolean>>) {
    try {
      const token = await fetchGoogleToken();
      if (!token || token === "") throw new Error("Usuário não autenticado");
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
      alert(e);
      console.error(e);
    }
  }

  async function fetchGoogleToken(): Promise<string | undefined> {
    const tokenObj = await chrome.identity.getAuthToken({ interactive: true });
    return tokenObj.token;
  }

  return { assessAuthentication };
}
