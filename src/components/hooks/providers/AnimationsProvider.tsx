import {
  Dispatch,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { Prettify } from "../../../global";

type AnimationsContext = {
  show?: Show;
  elementRef?: ElementRef;
  toggleVisibility: (element: AnimatableObjects) => void;
  setDisplayingAnimation: (element: AnimatableObjects) => void;
  setHidingAnimation: (element: AnimatableObjects, dispatchedFunction: () => void) => void;
};

type AnimatableObjects = "filter" | "colunaKanban" | "newTarefaColunaKanban";

type ShowStates = {
  [key in AnimatableObjects]: {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
  };
};

type ElementRef = { [key in AnimatableObjects]: RefObject<HTMLDivElement> };

type Show = { [key in AnimatableObjects]: boolean };

const AnimationsContext = createContext<Prettify<AnimationsContext>>({
  show: undefined,
  elementRef: undefined,
  toggleVisibility: () => {},
  setDisplayingAnimation: () => {},
  setHidingAnimation: () => {},
});

export function useAnimations() {
  return useContext(AnimationsContext);
}

export default function AnimationsProvider({ children }: PropsWithChildren) {
  const elementRef: ElementRef = {
    filter: useRef<HTMLDivElement>(null),
    colunaKanban: useRef<HTMLDivElement>(null),
    newTarefaColunaKanban: useRef<HTMLDivElement>(null),
  };

  const emptyState = {
    show: false,
    setShow: () => {},
  };

  const showStates: ShowStates = {
    filter: { ...emptyState },
    colunaKanban: { ...emptyState },
    newTarefaColunaKanban: { ...emptyState },
  };
  const show: Show = { filter: false, colunaKanban: false, newTarefaColunaKanban: false };
  for (let prop in elementRef) {
    ({ 0: showStates[prop as AnimatableObjects].show, 1: showStates[prop as AnimatableObjects].setShow } =
      useState<boolean>(false));
    show[prop as AnimatableObjects] = showStates[prop as AnimatableObjects].show;
  }

  function toggleVisibility(element: AnimatableObjects): void {
    if (!showStates[element].show) {
      showStates[element].setShow(current => !current);
    } else {
      const dispatchedFunction = () => showStates[element].setShow(current => !current);
      setHidingAnimation(element, dispatchedFunction);
    }
  }

  function setDisplayingAnimation(element: AnimatableObjects): void {
    elementRef[element].current?.style.setProperty("animation", "drop-filter 500ms normal ease-in-out");
  }

  function setHidingAnimation(element: AnimatableObjects, dispatchedFunction: () => void): Promise<void> {
    return new Promise(resolve => {
      elementRef[element].current?.style.setProperty("animation", "pickup-filter 500ms normal ease-in-out");
      setTimeout(() => {
        dispatchedFunction();
        resolve();
      }, 450);
    });
  }

  const contextContent = {
    show,
    elementRef,
    toggleVisibility,
    setDisplayingAnimation,
    setHidingAnimation,
  };

  return <AnimationsContext.Provider value={contextContent}>{children}</AnimationsContext.Provider>;
}
