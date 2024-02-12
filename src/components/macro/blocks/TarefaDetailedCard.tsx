import { Dispatch, SetStateAction, useEffect } from "react";
import useProjurisConnector from "../../hooks/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import { codigoUsuario } from "../../../hardcoded";
import Textarea from "../../micro/Textarea";
import ProcessoInfo from "../../micro/ProcessoInfoCard";
import TarefaDetailedCardHeader from "./TarefaDetailedCardHeader";
import PrazosCard from "../../micro/PrazosCard";
import Button from "../../micro/Button";
import TarefaDetailedCardSkeleton from "../skeletons/TarefaDetailedCardSkeleton";
import { useAnimations } from "../../hooks/AnimationsProvider";
import AnimatableFetchingSelect from "../../micro/AnimatableFetchingSelect";
import { DisplayingTarefaDetails, Marcador, SimpleDocument } from "../../../global";
import { useTarefaDetails } from "../../hooks/TarefaDetailsProvider";

export type TarefaPrefetchDetails = {
  codigoTarefaEvento: number;
  codigoProcesso: number;
  parteAtiva: string;
  partePassiva: string;
  numeroProcesso: string;
  tarefaColor: string;
};

export type TarefaDetailedCardProps = TarefaPrefetchDetails & {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
};

export default function TarefaDetailedCard({
  codigoTarefaEvento,
  codigoProcesso,
  parteAtiva,
  partePassiva,
  numeroProcesso,
  tarefaColor,
  setPrefetchDetails,
}: TarefaDetailedCardProps) {
  const { setHidingAnimation } = useAnimations();
  const { endpoints } = useProjurisConnector();
  const {
    displayingTarefaDetails,
    isDetailLoading,
    updateParams,
    updateTarefaDetails,
    saveTarefa,
    setTarefaLoadingDetails,
    loadDetails,
    updatesOnColunaKanbanChange,
  } = useTarefaDetails();

  const {
    displayTitulo,
    processoUrl,
    dataConclusao,
    dataConclusaoPrevista,
    dataLimite,
    descricaoTarefa,
    gruposResponsaveis,
    usuariosResponsaveis,
    marcadorWs,
    colunaKanban,
    quadroKanban,
    prazoColorCssVariable,
  } = displayingTarefaDetails ?? ({} as DisplayingTarefaDetails);

  useEffect(() => {
    setTarefaLoadingDetails({ codigoTarefaEvento, codigoProcesso, tarefaColor });
  }, [codigoTarefaEvento, codigoProcesso, tarefaColor]);

  function handleQuadroKanbanChange(newValue: unknown) {
    if (!newValue) {
      setHidingAnimation("colunaKanban", () => updateTarefaDetails({ quadroKanban: newValue }));
    } else {
      updateTarefaDetails({ quadroKanban: newValue });
    }
  }

  return isDetailLoading ? (
    <TarefaDetailedCardSkeleton />
  ) : (
    <section className="card tarefa-card tarefa-detailed-card">
      <TarefaDetailedCardHeader
        {...{
          displayTitulo,
          setPrefetchDetails,
          circleColor: tarefaColor,
          codigoQuadroKanban: quadroKanban?.chave,
          codigoTarefaEvento,
          codigoProcesso,
          loadDetails,
          updateParams,
        }}
      />
      <PrazosCard
        {...{ dataConclusao, dataConclusaoPrevista, dataLimite }}
        onChange={updateTarefaDetails}
        prazoColorCssVariable={prazoColorCssVariable ?? ""}
      />
      <ProcessoInfo {...{ parteAtiva, partePassiva, numeroProcesso, processoUrl }} />
      <Textarea
        name="descricao"
        label="Descrição"
        onChange={ev => updateTarefaDetails({ descricaoTarefa: ev.target.value })}
        content={descricaoTarefa}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={usuariosResponsaveis}
        onChange={newValue => updateTarefaDetails({ usuariosResponsaveis: newValue as SimpleDocument[] })}
        name="responsaveis"
        label="Responsáveis"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.gruposTrabalho}
        hasMultiLevelSource={false}
        values={gruposResponsaveis}
        onChange={newValue => updateTarefaDetails({ gruposResponsaveis: newValue as SimpleDocument[] })}
        name="grupos-trabalho"
        label="Grupos de trabalho"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.marcadores}
        hasMultiLevelSource={false}
        values={marcadorWs}
        onChange={newValue => updateTarefaDetails({ marcadorWs: newValue as Marcador[] })}
        filterObject={{ key: "nomeMarcador" }}
        name="marcadores"
        label="Marcadores"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.quadrosKanban(codigoUsuario)}
        hasMultiLevelSource={false}
        values={quadroKanban ? [quadroKanban] : undefined}
        onChange={handleQuadroKanbanChange}
        name="quadro-kanban"
        label="Quadro kanban"
        isMulti={false}
      />
      <AnimatableFetchingSelect
        condition={!!quadroKanban}
        optionsEndpoint={endpoints.colunasKanban(quadroKanban?.chave)}
        hasMultiLevelSource={false}
        values={colunaKanban ? [colunaKanban] : undefined}
        onChange={newValue => updatesOnColunaKanbanChange(newValue as SimpleDocument)}
        name="coluna-kanban"
        label="Coluna kanban"
        isMulti={false}
      />
      <div className="btn-container">
        <Button name="salvar-tarefa" caption="Salvar alterações" className="btn save-btn" onClick={saveTarefa} />
      </div>
      <footer className="tarefa-card-footer">{}</footer>
    </section>
  );
}
