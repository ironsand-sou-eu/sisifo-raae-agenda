import { ComponentPropsWithoutRef } from "react";
import ErrorDiv from "./ErrorDiv";

type MaskedNumberInputProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  label: string;
  mask: string;
};

export default function MaskedNumberInput({
  error,
  label,
  name,
  mask,
  value,
  ...rest
}: MaskedNumberInputProps): JSX.Element {
  const style = error ? { borderColor: "var(--fill-color-red)" } : undefined;

  return (
    <div>
      <label className="sisifo-label" htmlFor={name}>
        {label}
      </label>
      <ErrorDiv error={error} />
      <input {...{ ...rest, style, name }} type="text" value={value ?? ""} id={name} maxLength={mask.length + 1} />
    </div>
  );
}
