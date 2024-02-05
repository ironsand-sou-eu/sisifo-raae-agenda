import envVars from "../../envVars";
import { projurisLoginUri } from "../../hardcoded";

type ProjurisAccessToken = {
  projurisToken: string;
  projurisExpiration: number;
};

export default function useProjurisAuthConnector() {
  async function getProjurisAuthTokenWithinExpiration(): Promise<string> {
    const tokenResponse = (await chrome.storage.local.get([
      "projurisToken",
      "projurisExpiration",
    ])) as ProjurisAccessToken;
    console.log({ tokenResponse });
    // const tokenResponse = await chrome.storage.local.get(["projurisToken", "projurisExpiration"]);
    // const projurisToken = localStorage.getItem("projurisToken") ?? "";
    // const projurisExpiration: number = parseInt(localStorage.getItem("projurisExpiration") ?? "0");
    // const tokenResponse = { projurisToken, projurisExpiration };
    const noToken = !("projurisToken" in tokenResponse);
    const tokenExpired =
      "projurisExpiration" in tokenResponse && Number(tokenResponse.projurisExpiration) < new Date().getTime();
    if (noToken || tokenExpired) return await fetchAndStoreNewProjurisAuthToken();
    return tokenResponse.projurisToken;
  }

  async function fetchAndStoreNewProjurisAuthToken(): Promise<string> {
    const { projurisToken, projurisExpiration } = await fetchProjurisAuthToken();
    await chrome.storage.local.set({ projurisToken, projurisExpiration });
    // localStorage.setItem("projurisToken", projurisToken);
    // localStorage.setItem("projurisExpiration", `${projurisExpiration}`);
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
