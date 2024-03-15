import { PropsWithChildren, useLayoutEffect } from "react";
import { AnimatableElement, AnimationsContext, useAnimations } from "../hooks/providers/AnimationsProvider";

type AnimationContainerProps = PropsWithChildren<Omit<AnimatableElement, "ref" | "activeClass" | "activeInlineStyle">>;

export default function AnimationContainer({
  children,
  displayingClass,
  displayingInlineStyle,
  hidingClass,
  hidingInlineStyle,
  hidingTimeoutDelay,
  id,
  startRetracted,
}: AnimationContainerProps) {
  const { registerAnimatableElement, isVisible, getAnimatableElement } = useAnimations() as AnimationsContext;
  const activeClass = startRetracted ? hidingClass : displayingClass;
  const activeInlineStyle = startRetracted ? hidingInlineStyle : displayingInlineStyle;

  useLayoutEffect(() => {
    const animatableElement = {
      id,
      activeClass,
      displayingClass,
      hidingClass,
      activeInlineStyle,
      displayingInlineStyle,
      hidingInlineStyle,
      hidingTimeoutDelay: hidingTimeoutDelay ?? 0,
    } as AnimatableElement;
    registerAnimatableElement(animatableElement, !startRetracted);
  }, []);

  const element = getAnimatableElement(id);

  return (
    <>
      {isVisible(id) && (
        <div className={element?.activeClass} style={element?.activeInlineStyle}>
          {children}
        </div>
      )}
    </>
  );
}
