import { MouseEventHandler, useRef } from "react";

type CancelProps = {
  label?: string;
  rgbaColor?: string;
  onClick: MouseEventHandler<HTMLDivElement>;
};

export default function Cancel({ label, rgbaColor, onClick }: CancelProps): JSX.Element {
  const div = useRef<HTMLDivElement>(null);
  div.current?.style.setProperty("--fill-color-cancel", rgbaColor ?? "#c80a0ae6");
  return (
    <div ref={div} className="tarefa-card-button" title={label ?? "Cancelar tarefa"} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--> */}
        <path
          className="cancel"
          d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
        />
      </svg>
    </div>
  );
}
