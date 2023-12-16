import { MouseEventHandler, useEffect } from "react";

type HeaderButtonProps = {
  type: "cancel" | "conclude" | "filter" | "timesheet";
  title?: string;
  rgbaColor?: string;
  onClick: MouseEventHandler<HTMLDivElement>;
};

const standards = {
  cancel: {
    title: "Cancelar tarefa",
    pathD:
      "M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z",
  },
  conclude: {
    title: "Concluir tarefa",
    pathD:
      "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z",
  },
  filter: {
    title: "Filtrar",
    pathD:
      "M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z",
  },
  timesheet: {
    title: "Timesheet",
    pathD:
      "M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z",
  },
};

export default function HeaderButton({ type, title, rgbaColor, onClick }: HeaderButtonProps): JSX.Element {
  useEffect(() => {
    if (rgbaColor) document.documentElement.style.setProperty(`--fill-color-${type}`, rgbaColor);
  }, [rgbaColor]);

  return (
    <div role="button" className="tarefa-card-button" title={title ?? standards[type].title} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--> */}
        <path className={type} d={standards[type].pathD} />
      </svg>
    </div>
  );
}
