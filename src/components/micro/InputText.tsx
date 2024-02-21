import { ComponentPropsWithoutRef } from "react";
import ErrorDiv from "./ErrorDiv";

type InputTextProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  label?: string;
};

export default function InputText({ value, error, label, ...rest }: InputTextProps): JSX.Element {
  const style = error ? { borderColor: "var(--fill-color-red)" } : undefined;

  return (
    <div>
      <label className="sisifo-label">
        {label}
        <ErrorDiv error={error} />
        <input type="text" value={value ?? ""} {...{ ...rest, style }} />
      </label>
    </div>
  );
}
