import { MouseEventHandler, useRef } from "react";

type TimesheetButtonProps = {
  label?: string;
  rgbaColor?: string;
  onClick: MouseEventHandler<HTMLDivElement>;
};

export default function TimesheetButton({ label, rgbaColor, onClick }: TimesheetButtonProps): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);
  divRef.current?.style.setProperty("--fill-color-timesheet", rgbaColor ?? "#0954bde6");

  return (
    <div ref={divRef} className="tarefa-card-button" title={label ?? "Timesheet"} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        {/* <!-- ! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --> */}
        <path
          className="timesheet"
          d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
        />
      </svg>
    </div>
  );
}
