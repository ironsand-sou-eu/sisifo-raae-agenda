import { MouseEventHandler } from "react";

type ButtonProps = {
  name: string;
  caption: string;
  className: string;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function Button({ name, caption, className, disabled, onClick }: ButtonProps): JSX.Element {
  return (
    <button className={className} disabled={disabled} name={name} onClick={onClick}>
      {caption}
    </button>
  );
}
