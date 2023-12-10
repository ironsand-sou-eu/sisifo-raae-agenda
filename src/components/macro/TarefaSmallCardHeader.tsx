import { Dispatch, SetStateAction } from "react";
import CancelButton from "../micro/CancelButton";
import TimesheetButton from "../micro/TimesheetButton";
import ConcludeButton from "../micro/ConcludeButton";
import { TarefaRenderingDetails } from "./TarefaDetailedCard";

type TarefaSmallCardHeaderProps = {
  setRenderDetails: Dispatch<SetStateAction<TarefaRenderingDetails | undefined>>;
  nomeTarefaTipo: string;
  codigoTarefaEvento: number;
  codigoProcesso: number;
  numeroProcesso: string;
  parteAtiva: string;
  partePassiva: string;
  tarefaColor: string;
};

export default function TarefaSmallCardHeader({
  nomeTarefaTipo,
  parteAtiva,
  partePassiva,
  numeroProcesso,
  codigoTarefaEvento,
  codigoProcesso,
  tarefaColor,
  setRenderDetails,
}: TarefaSmallCardHeaderProps): JSX.Element {
  function renderDetails(): void {
    setRenderDetails({ parteAtiva, partePassiva, numeroProcesso, codigoProcesso, codigoTarefaEvento, tarefaColor });
  }

  function getCheckboxName(): string {
    return `chk-tarefa-${codigoProcesso}`;
  }

  return (
    <header className="tarefa-card-titulo">
      <div>
        <input
          style={{ backgroundColor: tarefaColor }}
          className="tarefa-card-titulo-checkbox"
          type="checkbox"
          name={getCheckboxName()}
          id={getCheckboxName()}
        />
        <h2 onClick={renderDetails}>{nomeTarefaTipo}</h2>
      </div>
      <div>
        <CancelButton onClick={e => console.log(e)} />
        <TimesheetButton onClick={e => console.log(e)} />
        <ConcludeButton onClick={e => console.log(e)} />
      </div>
    </header>
  );
}
