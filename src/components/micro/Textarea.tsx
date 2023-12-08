type TextareaProps = {
  nameAndId: string;
  label: string;
  content?: string;
};

export default function Textarea({ nameAndId, label, content }: TextareaProps): JSX.Element {
  return (
    <div>
      <label className="sisifo-label" htmlFor={nameAndId}>
        {label}
      </label>
      <textarea id={nameAndId} name={nameAndId} defaultValue={content} />
    </div>
  );
}
