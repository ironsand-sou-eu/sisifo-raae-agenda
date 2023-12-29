import { Dispatch, SetStateAction } from "react";
import HeaderButton from "../micro/HeaderButton";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";

type TarefaDetailedCardHeaderProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  tarefaColor?: string;
  displayTitulo?: string;
};

export default function TarefaDetailedCardHeader({ setPrefetchDetails, tarefaColor, displayTitulo }: TarefaDetailedCardHeaderProps): JSX.Element {
  return (
    <header className="tarefa-card-titulo">
      <div onClick={() => setPrefetchDetails(undefined)} className="close-btn">
        +
      </div>
      <div>
        <div style={{ backgroundColor: tarefaColor }} className="circle" />
        <h2>{displayTitulo}</h2>
      </div>
      <div>
        <HeaderButton type="cancel" onClick={e => console.log(e)} />
        <HeaderButton type="timesheet" onClick={e => console.log(e)} />
        <HeaderButton type="conclude" onClick={e => console.log(e)} />
      </div>
    </header>
  );
}
