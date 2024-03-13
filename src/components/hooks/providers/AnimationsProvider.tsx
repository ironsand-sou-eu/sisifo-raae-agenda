import { CSSProperties, PropsWithChildren, createContext, useContext, useState } from "react";

export type AnimatableElement = {
  id: string;
  hidingTimeoutDelay?: number;
} & (
  | {
      activeClass: string;
      displayingClass: string;
      hidingClass: string;
      activeInlineStyle?: undefined;
      displayingInlineStyle?: undefined;
      hidingInlineStyle?: undefined;
    }
  | {
      activeClass?: undefined;
      displayingClass?: undefined;
      hidingClass?: undefined;
      activeInlineStyle: CSSProperties;
      displayingInlineStyle: CSSProperties;
      hidingInlineStyle: CSSProperties;
    }
);

export type AnimationsContext = {
  registerAnimatableElement: (element: AnimatableElement, showState?: boolean) => void;
  unregisterAnimatableElement: (idToRemove: string) => void;
  getAnimatableElement: (id: string) => AnimatableElement | undefined;
  isVisible: (id: string) => boolean;
  toggleVisibility: (id: string, enforceState?: "hide" | "show") => void;
};

const AnimationsContext = createContext<AnimationsContext | undefined>(undefined);

export function useAnimations() {
  return useContext(AnimationsContext);
}

export default function AnimationsProvider({ children }: PropsWithChildren) {
  const [elements, setElements] = useState(new Map<string, AnimatableElement>());
  const [show, setShow] = useState(new Map<string, boolean>());
  const fallbackTimeoutDelay = 450;

  function registerAnimatableElement(element: AnimatableElement, showState: boolean = true): void {
    setShow(prevElements => new Map([...prevElements, [element.id, showState]]));
    setElements(prevElements => new Map([...prevElements, [element.id, element]]));
  }

  function unregisterAnimatableElement(idToRemove: string): void {
    const showClone = new Map(show);
    const elementsClone = new Map(elements);
    showClone.delete(idToRemove);
    elementsClone.delete(idToRemove);

    setShow(showClone);
    setElements(elementsClone);
  }

  function getAnimatableElement(id: string): AnimatableElement | undefined {
    return elements.get(id);
  }

  function isVisible(id: string): boolean {
    return show.get(id) ?? false;
  }

  function toggleVisibility(id: string, enforceState?: "hide" | "show"): void {
    const element = elements.get(id);
    if (show.get(id) || enforceState === "hide") {
      const hidingFunction = () => setShow(prevElements => new Map([...prevElements, [id, false]]));
      if (element) setHidingAnimation(element, hidingFunction);
    } else if (enforceState === "show") {
      if (element) setDisplayingAnimation(element);
      setShow(prevElements => new Map([...prevElements, [id, true]]));
    } else {
      setShow(prevElements => new Map([...prevElements, [id, true]]));
    }
  }

  function setDisplayingAnimation(element: AnimatableElement) {
    let newElement = { ...element };
    if (element.displayingClass) newElement.activeClass = element.displayingClass;
    if (element.displayingInlineStyle) newElement.activeInlineStyle = element.displayingInlineStyle;
    setElements(prevElements => new Map([...prevElements, [element.id, newElement]]));
  }

  function setHidingAnimation(element: AnimatableElement, dispatchedFunction: () => void): Promise<void> {
    return new Promise(resolve => {
      let newElement = { ...element };
      if (element.hidingClass) newElement.activeClass = element.hidingClass;
      if (element.hidingInlineStyle) newElement.activeInlineStyle = element.hidingInlineStyle;
      setElements(prevElements => new Map([...prevElements, [element.id, newElement]]));
      setTimeout(() => {
        dispatchedFunction();
        // unregisterAnimatableElement(element.id);
        resolve();
      }, element.hidingTimeoutDelay ?? fallbackTimeoutDelay);
    });
  }

  const contextContent = {
    registerAnimatableElement,
    unregisterAnimatableElement,
    getAnimatableElement,
    isVisible,
    toggleVisibility,
  };

  return <AnimationsContext.Provider value={contextContent}>{children}</AnimationsContext.Provider>;
}
