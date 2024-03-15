import { PropsWithChildren, useLayoutEffect } from "react";
import { AnimatableElement, AnimationsContext, useAnimations } from "../hooks/providers/AnimationsProvider";

type AnimationContainerProps = PropsWithChildren<Omit<AnimatableElement, "ref" | "activeClass" | "activeInlineStyle">>;

export default function AnimationContainer({
  id,
  displayingClass,
  hidingClass,
  displayingInlineStyle,
  hidingInlineStyle,
  hidingTimeoutDelay,
  children,
}: AnimationContainerProps) {
  const { registerAnimatableElement, isVisible, getAnimatableElement } = useAnimations() as AnimationsContext;

  const activeClass = displayingClass;
  const activeInlineStyle = displayingInlineStyle;

  useLayoutEffect(() => {
    registerAnimatableElement({
      id,
      activeClass,
      displayingClass,
      hidingClass,
      activeInlineStyle,
      displayingInlineStyle,
      hidingInlineStyle,
      hidingTimeoutMs: hidingTimeoutDelay ?? 0,
    } as AnimatableElement);
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
