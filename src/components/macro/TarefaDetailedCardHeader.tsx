import { Dispatch, SetStateAction } from "react";
import HeaderButton from "../micro/HeaderButton";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import useProjurisConnector from "../hooks/useProjurisConnector";

type TarefaDetailedCardHeaderProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  tarefaColor?: string;
  displayTitulo?: string;
  codigoQuadroKanban?: number;
  codigoTarefaEvento?: number;
  loadDetails?: () => void;
};

export default function TarefaDetailedCardHeader({
  setPrefetchDetails,
  tarefaColor,
  displayTitulo,
  codigoQuadroKanban,
  codigoTarefaEvento,
  loadDetails,
}: TarefaDetailedCardHeaderProps): JSX.Element {
  const { dispatchBackendTarefaUpdate } = useProjurisConnector();
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
        <HeaderButton
          type="cancel"
          onClick={() =>
            dispatchBackendTarefaUpdate({
              type: "cancelar",
              name: displayTitulo,
              reloadFunction: loadDetails,
              codigoTarefaEvento,
              findingCode: { codigoQuadroKanban: codigoQuadroKanban ?? -1 },
            })
          }
        />
        <HeaderButton type="timesheet" onClick={e => console.log(e)} />
        <HeaderButton
          type="conclude"
          onClick={() =>
            dispatchBackendTarefaUpdate({
              type: "concluir",
              name: displayTitulo,
              reloadFunction: loadDetails,
              codigoTarefaEvento,
              findingCode: { codigoQuadroKanban: codigoQuadroKanban ?? -1 },
            })
          }
        />
      </div>
    </header>
  );
}
