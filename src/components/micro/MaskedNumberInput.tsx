import { ComponentPropsWithoutRef } from "react";

type MaskedNumberInputProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  mask: string;
};

export default function MaskedNumberInput({
  label,
  name,
  mask,
  value,
  onChange,
  ...rest
}: MaskedNumberInputProps): JSX.Element {
  return (
    <div>
      <label className="sisifo-label" htmlFor={name}>
        {label}
      </label>
      <input {...rest} type="text" value={value} id={name} name={name} maxLength={mask.length} />
    </div>
  );
}
