import { Dispatch, SetStateAction } from "react";
import HeaderButton from "../../micro/HeaderButton";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import useProjurisTarefasConnector, { TarefaUpdateParams } from "../../hooks/connectors/useProjurisTarefasConnector";
import DetailedCardHeader from "./DetailedCardHeader";
import { CreateEntitiesContext, useCreateEntities } from "../../hooks/providers/CreateEntitiesProvider";
import { TarefaDetailsContext, useTarefaDetails } from "../../hooks/providers/TarefaDetailsProvider";

type TarefaDetailedCardHeaderProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  circleColor?: string;
  codigoProcesso?: number;
  displayTitulo?: string;
  updateParams?: TarefaUpdateParams;
};

export default function TarefaDetailedCardHeader({
  setPrefetchDetails,
  circleColor,
  codigoProcesso,
  displayTitulo,
  updateParams,
}: TarefaDetailedCardHeaderProps): JSX.Element {
  const { dispatchBackendTarefaUpdate } = useProjurisTarefasConnector();
  const { tarefaDetails } = useTarefaDetails() as TarefaDetailsContext;
  const { setAndamentoTimesheetPanelVisibility } = useCreateEntities() as CreateEntitiesContext;
  const cancelParams = { ...updateParams, type: "cancelar" } as TarefaUpdateParams;
  const concludeParams = { ...updateParams, type: "concluir" } as TarefaUpdateParams;

  function handleClick(clickedUpdateParams?: TarefaUpdateParams) {
    if (!clickedUpdateParams) return;
    dispatchBackendTarefaUpdate(clickedUpdateParams);
  }

  const buttonsDiv = (
    <div>
      <HeaderButton type="cancel" onClick={() => handleClick(cancelParams)} />
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
      <HeaderButton type="conclude" onClick={() => handleClick(concludeParams)} />
    </div>
  );

  return (
    <DetailedCardHeader
      {...{
        caption: displayTitulo,
        circleColor,
        rightDiv: buttonsDiv,
        closeFunction: () => setPrefetchDetails(undefined),
      }}
    />
  );
}
