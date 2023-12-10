import { MouseEventHandler, useRef } from "react";

type ConcludeButtonProps = {
  label?: string;
  rgbaColor?: string;
  onClick: MouseEventHandler<HTMLDivElement>;
};

export default function ConcludeButton({ label, rgbaColor, onClick }: ConcludeButtonProps): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);
  divRef.current?.style.setProperty("--fill-color-conclude", rgbaColor ?? "#099302e6");

  return (
    <div ref={divRef} className="tarefa-card-button" title={label ?? "Concluir tarefa"} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        {/* <!-- ! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --> */}
        <path
          className="conclude"
          d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
        />
      </svg>
    </div>
  );
}
