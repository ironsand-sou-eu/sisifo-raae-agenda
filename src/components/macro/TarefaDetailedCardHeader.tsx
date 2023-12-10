import { Dispatch, SetStateAction } from "react";
import CancelButton from "../micro/CancelButton";
import TimesheetButton from "../micro/TimesheetButton";
import ConcludeButton from "../micro/ConcludeButton";
import { TarefaRenderingDetails } from "./TarefaDetailedCard";

type TarefaDetailedCardHeaderProps = {
  setRenderDetails: Dispatch<SetStateAction<TarefaRenderingDetails | undefined>>;
  tipoTarefa?: string;
  titulo?: string;
  tarefaColor?: string;
};

export default function TarefaDetailedCardHeader({
  tipoTarefa,
  titulo,
  setRenderDetails,
  tarefaColor,
}: TarefaDetailedCardHeaderProps): JSX.Element {
  return (
    <header className="tarefa-card-titulo">
      <div onClick={() => setRenderDetails(undefined)} className="close-btn">
        +
      </div>
      <div>
        <div style={{ backgroundColor: tarefaColor ?? "" }} className="circle" />
        <h2>{titulo ?? tipoTarefa ?? ""}</h2>
      </div>
      <div>
        <CancelButton onClick={e => console.log(e)} />
        <TimesheetButton onClick={e => console.log(e)} />
        <ConcludeButton onClick={e => console.log(e)} />
      </div>
    </header>
  );
}
