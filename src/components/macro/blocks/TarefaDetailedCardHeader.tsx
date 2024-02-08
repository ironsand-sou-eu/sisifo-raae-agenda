import { Dispatch, SetStateAction } from "react";
import HeaderButton from "../../micro/HeaderButton";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import useProjurisTarefasConnector, { TarefaUpdateParams } from "../../hooks/useProjurisTarefasConnector";
import DetailedCardHeader from "./DetailedCardHeader";

type TarefaDetailedCardHeaderProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  circleColor?: string;
  displayTitulo?: string;
  updateParams?: TarefaUpdateParams;
};

export default function TarefaDetailedCardHeader({
  setPrefetchDetails,
  circleColor,
  displayTitulo,
  updateParams,
}: TarefaDetailedCardHeaderProps): JSX.Element {
  const { dispatchBackendTarefaUpdate } = useProjurisTarefasConnector();
  const cancelParams = { ...updateParams, type: "cancelar" } as TarefaUpdateParams;
  const concludeParams = { ...updateParams, type: "concluir" } as TarefaUpdateParams;

  function handleClick(clickedUpdateParams?: TarefaUpdateParams) {
    if (!clickedUpdateParams) return;
    dispatchBackendTarefaUpdate(clickedUpdateParams);
  }

  const buttonsDiv = (
    <div>
      <HeaderButton type="cancel" onClick={() => handleClick(cancelParams)} />
      <HeaderButton type="timesheet" disabled={true} onClick={() => {}} />
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
