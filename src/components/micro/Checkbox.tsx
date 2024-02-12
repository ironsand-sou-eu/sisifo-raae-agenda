import { ComponentPropsWithoutRef } from "react";

type CheckboxProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
};

export default function Checkbox({ label, ...rest }: CheckboxProps): JSX.Element {
  return (
    <div className="pad-block-sm">
      <label>
        <input type="checkbox" {...rest} />
        {label}
      </label>
    </div>
  );
}
