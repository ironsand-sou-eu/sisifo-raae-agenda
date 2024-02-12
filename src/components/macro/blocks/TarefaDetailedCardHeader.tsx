import { Dispatch, SetStateAction } from "react";
import HeaderButton from "../../micro/HeaderButton";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import useProjurisTarefasConnector, { TarefaUpdateParams } from "../../hooks/useProjurisTarefasConnector";
import DetailedCardHeader from "./DetailedCardHeader";
import { useAndamentosTimesheets } from "../../hooks/AndamentosTimesheetsProvider";

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
  const { setAndamentosTarefasPanelVisibility } = useAndamentosTimesheets();
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
          if (codigoProcesso) setAndamentosTarefasPanelVisibility({ visible: true, codigoProcesso });
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
