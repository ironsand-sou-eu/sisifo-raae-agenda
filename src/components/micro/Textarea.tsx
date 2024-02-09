import { ComponentPropsWithoutRef } from "react";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  label?: string;
  content?: string;
};

export default function Textarea({ name, content, label, ...rest }: TextareaProps): JSX.Element {
  return (
    <div>
      <label className="sisifo-label" htmlFor={name}>
        {label}
      </label>
      <textarea id={name} value={content ?? ""} {...rest} />
    </div>
  );
}
