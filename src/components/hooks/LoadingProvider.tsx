import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useState } from "react";

type LoadingContents = {
  loadingList: boolean;
  loadingDetails: boolean;
};

type TLoadingContext = LoadingContents & { setIsLoading: Dispatch<SetStateAction<LoadingContents>> };

const initValues = { loadingList: false, loadingDetails: false, setIsLoading: () => {} };
const LoadingContext = createContext<TLoadingContext>(initValues);

export function useLoading() {
  return useContext(LoadingContext);
}

export default function LoadingProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState<LoadingContents>(initValues);

  return <LoadingContext.Provider value={{ ...isLoading, setIsLoading }}>{children}</LoadingContext.Provider>;
}
