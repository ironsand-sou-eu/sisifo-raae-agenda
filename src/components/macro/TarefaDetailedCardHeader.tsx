import { Dispatch, SetStateAction } from "react";
import HeaderButton from "../micro/HeaderButton";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import useProjurisConnector, { TarefaUpdateParams } from "../hooks/useProjurisConnector";

type TarefaDetailedCardHeaderProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  tarefaColor?: string;
  displayTitulo?: string;
  updateParams?: TarefaUpdateParams;
};

export default function TarefaDetailedCardHeader({
  setPrefetchDetails,
  tarefaColor,
  displayTitulo,
  updateParams,
}: TarefaDetailedCardHeaderProps): JSX.Element {
  const { dispatchBackendTarefaUpdate } = useProjurisConnector();
  const cancelParams = { ...updateParams, type: "cancelar" } as TarefaUpdateParams;
  const concludeParams = { ...updateParams, type: "concluir" } as TarefaUpdateParams;

  function handleClick(clickedUpdateParams?: TarefaUpdateParams) {
    if (!clickedUpdateParams) return;
    dispatchBackendTarefaUpdate(clickedUpdateParams);
  }

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
        <HeaderButton type="cancel" onClick={() => handleClick(cancelParams)} />
        <HeaderButton type="timesheet" onClick={e => console.log(e)} />
        <HeaderButton type="conclude" onClick={() => handleClick(concludeParams)} />
      </div>
    </header>
  );
}
