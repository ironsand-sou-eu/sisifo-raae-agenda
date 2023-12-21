import { Dispatch, PropsWithChildren, RefObject, SetStateAction, createContext, useContext, useRef, useState } from "react";
import { Prettify } from "../../global";

type AnimationsContext = {
  showFilter: boolean;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
  bodyDivRef?: RefObject<HTMLDivElement>;
  toggleFilterVisibility: () => void;
  setBodyDisplayingAnimation: () => void;
};

const FilterAnimationsContext = createContext<Prettify<AnimationsContext>>({
  showFilter: false,
  setShowFilter: () => {},
  bodyDivRef: undefined,
  toggleFilterVisibility: () => {},
  setBodyDisplayingAnimation: () => {},
});

export function useFilterAnimations() {
  return useContext(FilterAnimationsContext);
}

export default function FilterAnimationsProvider({ children }: PropsWithChildren) {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const bodyDivRef = useRef<HTMLDivElement>(null);

  function toggleFilterVisibility(): void {
    if (!showFilter) {
      setShowFilter(current => !current);
    } else {
      setBodyHidingAnimation();
    }
  }

  function setBodyDisplayingAnimation(): void {
    bodyDivRef.current?.style.setProperty("animation", "drop-filter 500ms normal ease-in-out");
  }

  function setBodyHidingAnimation(): Promise<void> {
    return new Promise(resolve => {
      bodyDivRef.current?.style.setProperty("animation", "pickup-filter 500ms normal ease-in-out");
      setTimeout(() => {
        setShowFilter(current => !current);
        resolve();
      }, 450);
    });
  }

  const contextContent = {
    showFilter,
    setShowFilter,
    bodyDivRef,
    toggleFilterVisibility,
    setBodyDisplayingAnimation,
  };

  return <FilterAnimationsContext.Provider value={contextContent}>{children}</FilterAnimationsContext.Provider>;
}
