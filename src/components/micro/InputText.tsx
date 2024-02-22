import { ComponentPropsWithoutRef } from "react";
import ErrorDiv from "./ErrorDiv";

type InputTextProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  label?: string;
};

export default function InputText({ value, error, label, name, ...rest }: InputTextProps): JSX.Element {
  const style = error ? { borderColor: "var(--fill-color-red)" } : undefined;

  return (
    <div>
      <label className="sisifo-label" htmlFor={name}>
        {label}
      </label>
      <ErrorDiv error={error} />
      <input type="text" id={name} value={value ?? ""} {...{ ...rest, style, name }} />
    </div>
  );
}
