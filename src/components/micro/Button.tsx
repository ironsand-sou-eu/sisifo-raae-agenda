import { MouseEventHandler } from "react";

type ButtonProps = {
  name: string;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function Button({ name, disabled, onClick }: ButtonProps): JSX.Element {
  return (
    <button className="save-btn" disabled={disabled} name={name} onClick={onClick}>
      Salvar alterações
    </button>
  );
}
