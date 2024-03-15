import { ComponentPropsWithoutRef, useId } from "react";
import ErrorDiv from "./ErrorDiv";
import AnimationContainer from "./AnimationContainer";
import { AnimationsContext, useAnimations } from "../hooks/providers/AnimationsProvider";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  content?: string;
  error?: string;
  label?: string;
  startRetracted?: boolean;
};

export default function Textarea({
  content,
  error,
  name,
  label,
  startRetracted = false,
  ...rest
}: TextareaProps): JSX.Element {
  const style = error ? { borderColor: "var(--fill-color-red)" } : undefined;
  const id = useId();
  const { isVisible, toggleVisibility } = useAnimations() as AnimationsContext;
  let isRetracted = !isVisible(id);

  return (
    <div>
      <label
        className="sisifo-label"
        htmlFor={name}
        onClick={() => toggleVisibility(id, isRetracted ? "show" : "hide")}
      >
        {`${label} `}
        <span className={`rotable${isRetracted ? " rotated" : ""}`}>▼</span>
      </label>
      <ErrorDiv error={error} />
      <AnimationContainer
        id={id}
        displayingInlineStyle={{ animation: "drop 500ms normal ease-in-out", transformOrigin: "top" }}
        hidingInlineStyle={{ animation: "pickup 500ms normal ease-in-out", transformOrigin: "top" }}
        startRetracted={startRetracted}
      >
        <textarea value={content ?? ""} id={name} {...{ ...rest, style, name }} />
      </AnimationContainer>
    </div>
  );
}
