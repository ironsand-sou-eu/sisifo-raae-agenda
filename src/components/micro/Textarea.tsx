import { ChangeEventHandler } from "react";

type TextareaProps = {
  nameAndId: string;
  label: string;
  onChange: (newValue: string) => void;
  content?: string;
};

export default function Textarea({ nameAndId, label, content, onChange }: TextareaProps): JSX.Element {
  return (
    <div>
      <label className="sisifo-label" htmlFor={nameAndId}>
        {label}
      </label>
      <textarea id={nameAndId} name={nameAndId} onChange={({ target }) => onChange(target.value)}>
        {content}
      </textarea>
    </div>
  );
}
