import { ComponentPropsWithoutRef, useId } from "react";
import ErrorDiv from "./ErrorDiv";
import { AnimationsContext, useAnimations } from "../hooks/providers/AnimationsProvider";
import AnimationContainer from "./AnimationContainer";

type InputTextProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  label?: string;
  startRetracted?: boolean;
};

export default function InputText({
  value,
  error,
  name,
  label,
  className,
  startRetracted = false,
  ...rest
}: InputTextProps): JSX.Element {
  const style = error ? { borderColor: "var(--fill-color-red)" } : undefined;
  const id = useId();
  const { isVisible, toggleVisibility } = useAnimations() as AnimationsContext;
  const isRetracted = !isVisible(id);

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
        <input
          type="text"
          className={`control-input ${className ?? ""}`.trim()}
          id={name}
          value={value ?? ""}
          {...{ ...rest, style, name }}
        />
      </AnimationContainer>
    </div>
  );
}
