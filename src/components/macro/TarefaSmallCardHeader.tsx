import { Dispatch, SetStateAction } from "react";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import HeaderButton from "../micro/HeaderButton";

type TarefaSmallCardHeaderProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
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
  setPrefetchDetails,
}: TarefaSmallCardHeaderProps): JSX.Element {
  function renderDetails(): void {
    setPrefetchDetails({ parteAtiva, partePassiva, numeroProcesso, codigoProcesso, codigoTarefaEvento, tarefaColor });
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
        <HeaderButton type="cancel" onClick={e => console.log(e)} />
        <HeaderButton type="timesheet" onClick={e => console.log(e)} />
        <HeaderButton type="conclude" onClick={e => console.log(e)} />
      </div>
    </header>
  );
}
