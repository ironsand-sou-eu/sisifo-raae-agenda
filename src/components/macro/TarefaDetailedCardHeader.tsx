import { Dispatch, SetStateAction } from "react";
import HeaderButton from "../micro/HeaderButton";
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
        <HeaderButton type="cancel" onClick={e => console.log(e)} />
        <HeaderButton type="timesheet" onClick={e => console.log(e)} />
        <HeaderButton type="conclude" onClick={e => console.log(e)} />
      </div>
    </header>
  );
}
