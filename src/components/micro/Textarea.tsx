import { ComponentPropsWithoutRef } from "react";
import ErrorDiv from "./ErrorDiv";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  content?: string;
  error?: string;
  label?: string;
};

export default function Textarea({ content, error, label, ...rest }: TextareaProps): JSX.Element {
  const style = error ? { borderColor: "var(--fill-color-red)" } : undefined;

  return (
    <div>
      <label className="sisifo-label">
        {label}
        <ErrorDiv error={error} />
        <textarea value={content ?? ""} {...{ ...rest, style }} />
      </label>
    </div>
  );
}
