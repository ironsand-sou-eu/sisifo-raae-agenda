import envVars from "../../envVars";
import { projurisLoginUri } from "../../hardcoded";

type ProjurisAccessToken = {
  projurisToken?: string;
  projurisExpiration?: number;
};

export default function useProjurisAuthConnector() {
  async function getProjurisAuthTokenWithinExpiration(): Promise<string> {
    let tokenResponse: ProjurisAccessToken = {};

    if (chrome.storage) {
      tokenResponse = await chrome.storage.local.get(["projurisToken", "projurisExpiration"]);
    } else {
      tokenResponse.projurisToken = localStorage.getItem("projurisToken") ?? "";
      tokenResponse.projurisExpiration = parseInt(localStorage.getItem("projurisExpiration") ?? "0");
    }
    const tokenExpired = Number(tokenResponse.projurisExpiration) < new Date().getTime();
    if (!tokenResponse.projurisToken || tokenExpired) return await fetchAndStoreNewProjurisAuthToken();
    return tokenResponse.projurisToken;
  }

  async function fetchAndStoreNewProjurisAuthToken(): Promise<string> {
    const { projurisToken, projurisExpiration } = await fetchProjurisAuthToken();
    if (chrome.storage) {
      await chrome.storage.local.set({ projurisToken, projurisExpiration });
    } else {
      localStorage.setItem("projurisToken", projurisToken ?? "");
      localStorage.setItem("projurisExpiration", `${projurisExpiration}`);
    }
    if (!projurisToken) throw new Error("Não foi possível obter um token de acesso ao Projuris");
    return projurisToken;
  }

  async function fetchProjurisAuthToken(): Promise<ProjurisAccessToken> {
    const secret = `${envVars.PROJURIS_API_CLIENT_ID}:${envVars.PROJURIS_API_CLIENT_SECRET}`;
    const secretHash = btoa(secret);

    const params = {
      method: "POST",
      async: true,
      headers: {
        Authorization: `Basic ${secretHash}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=password&username=${envVars.PROJURIS_API_USERNAME}$$${envVars.PROJURIS_API_DOMAIN}&password=${envVars.PROJURIS_API_PASSWORD}`,
    };
    const response = await fetch(projurisLoginUri, params);
    const tokenData = await response.json();
    const now = new Date();
    const projurisExpiration = now.getTime() + tokenData.expires_in * 1000;
    return {
      projurisToken: tokenData.access_token,
      projurisExpiration,
    };
  }

  return {
    getProjurisAuthTokenWithinExpiration,
  };
}
