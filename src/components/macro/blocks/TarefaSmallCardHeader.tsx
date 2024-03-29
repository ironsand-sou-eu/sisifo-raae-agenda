import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import HeaderButton from "../../micro/HeaderButton";
import { TarefasListContext, useTarefasList } from "../../hooks/providers/TarefasListProvider";
import useProjurisTarefasConnector, { TarefaUpdateParams } from "../../hooks/connectors/useProjurisTarefasConnector";
import { CreateEntitiesContext, useCreateEntities } from "../../hooks/providers/CreateEntitiesProvider";
import { TarefaDetailsContext, useTarefaDetails } from "../../hooks/providers/TarefaDetailsProvider";

type TarefaSmallCardHeaderProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  checked?: boolean;
  nomeTarefaTipo: string;
  codigoTarefaEvento: number;
  codigoProcesso: number;
  numeroProcesso: string;
  parteAtiva: string;
  partePassiva: string;
  tarefaColor: string;
  updateParams: TarefaUpdateParams;
};

export default function TarefaSmallCardHeader({
  checked,
  nomeTarefaTipo,
  parteAtiva,
  partePassiva,
  numeroProcesso,
  codigoTarefaEvento,
  codigoProcesso,
  tarefaColor,
  updateParams,
  setPrefetchDetails,
}: TarefaSmallCardHeaderProps): JSX.Element {
  const { toggleCheck } = useTarefasList() as TarefasListContext;
  const { dispatchBackendTarefaUpdate } = useProjurisTarefasConnector();
  const { tarefaDetails } = useTarefaDetails() as TarefaDetailsContext;
  const { setAndamentoTimesheetPanelVisibility } = useCreateEntities() as CreateEntitiesContext;
  function renderDetails(): void {
    setPrefetchDetails({ parteAtiva, partePassiva, numeroProcesso, codigoProcesso, codigoTarefaEvento, tarefaColor });
  }

  function getCheckboxName(): string {
    return `chk-tarefa-${codigoProcesso}--${codigoTarefaEvento}`;
  }

  function getProcessoAndTarefaCodesFromCheckboxId(id: string): number[] {
    const codes = id.replace("chk-tarefa-", "");
    return codes.split("--").map(code => parseInt(code));
  }

  function handleSelect({ target: { id } }: ChangeEvent) {
    const [_, codTarefaEvento] = getProcessoAndTarefaCodesFromCheckboxId(id);
    toggleCheck(codTarefaEvento);
  }
  const cancelParams = { ...updateParams, type: "cancelar" } as TarefaUpdateParams;
  const concludeParams = { ...updateParams, type: "concluir" } as TarefaUpdateParams;

  return (
    <header className="tarefa-card-titulo">
      <div>
        <input
          style={{ backgroundColor: tarefaColor }}
          className="tarefa-card-titulo-checkbox"
          type="checkbox"
          onChange={handleSelect}
          checked={checked}
          name={getCheckboxName()}
          id={getCheckboxName()}
        />
        <h2 onClick={renderDetails}>{nomeTarefaTipo}</h2>
      </div>
      <div>
        <HeaderButton type="cancel" onClick={() => dispatchBackendTarefaUpdate(cancelParams)} />
        <HeaderButton
          type="timesheet"
          onClick={() => {
            if (codigoProcesso)
              setAndamentoTimesheetPanelVisibility({
                visible: true,
                parentDetails: {
                  codigoProcesso,
                  idTarefa: tarefaDetails?.tarefaEventoWs.identificador ?? "",
                  tipoTarefa: tarefaDetails?.tarefaEventoWs.tipoTarefa.valor ?? "",
                },
              });
          }}
        />
        <HeaderButton type="conclude" onClick={() => dispatchBackendTarefaUpdate(concludeParams)} />
      </div>
    </header>
  );
}
