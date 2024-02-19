import { ComponentPropsWithoutRef } from "react";
import ErrorDiv from "./ErrorDiv";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  content?: string;
  error?: string;
  label?: string;
};

export default function Textarea({ content, error, label, name, ...rest }: TextareaProps): JSX.Element {
  const style = error ? { borderColor: "var(--fill-color-red)" } : undefined;

  return (
    <div>
      <label className="sisifo-label" htmlFor={name}>
        {label}
      </label>
      <ErrorDiv error={error} />
      <textarea id={name} value={content ?? ""} {...{ ...rest, style }} />
    </div>
  );
}
