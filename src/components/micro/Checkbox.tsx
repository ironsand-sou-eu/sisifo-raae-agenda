import { ComponentPropsWithoutRef } from "react";

type CheckboxProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
};

export default function Checkbox({ label, name, ...rest }: CheckboxProps): JSX.Element {
  return (
    <div className="pad-block-sm">
      <input id={name} name={name} type="checkbox" {...rest} />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}
