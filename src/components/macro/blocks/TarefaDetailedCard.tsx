import { Dispatch, SetStateAction, useEffect } from "react";
import useProjurisConnector from "../../hooks/connectors/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import { codigoUsuario } from "../../../hardcoded";
import Textarea from "../../micro/Textarea";
import ProcessoInfo from "../../micro/ProcessoInfoCard";
import TarefaDetailedCardHeader from "./TarefaDetailedCardHeader";
import PrazosCard from "../../micro/PrazosCard";
import Button from "../../micro/Button";
import TarefaDetailedCardSkeleton from "../skeletons/TarefaDetailedCardSkeleton";
import { useAnimations } from "../../hooks/providers/AnimationsProvider";
import AnimatableFetchingSelect from "../../micro/AnimatableFetchingSelect";
import { DisplayingTarefaDetails, Marcador, SimpleDocument } from "../../../global";
import { useTarefaDetails } from "../../hooks/providers/TarefaDetailsProvider";
import { useCreateEntities } from "../../hooks/providers/CreateEntitiesProvider";
import InputText from "../../micro/InputText";

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
  const { setNewTarefaPanelVisibility } = useCreateEntities();
  const { endpoints } = useProjurisConnector();
  const {
    displayingTarefaDetails,
    isDetailLoading,
    updateParams,
    updateTarefaDetails,
    saveTarefa,
    setTarefaLoadingDetails,
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
    local,
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
          setPrefetchDetails,
          circleColor: tarefaColor,
          codigoProcesso,
          displayTitulo,
          updateParams,
        }}
      />
      <PrazosCard
        {...{ dataConclusao, dataConclusaoPrevista, dataLimite }}
        dateAsNumber={true}
        onChange={updateTarefaDetails}
        prazoColorCssVariable={prazoColorCssVariable ?? ""}
      />
      <ProcessoInfo {...{ parteAtiva, partePassiva, numeroProcesso, processoUrl }} />
      <Textarea
        label="Descrição"
        name="descricao"
        onChange={ev => updateTarefaDetails({ descricaoTarefa: ev.target.value })}
        content={descricaoTarefa}
      />
      <InputText
        label="Local/Site"
        name="local"
        onChange={ev => updateTarefaDetails({ local: ev.target.value })}
        value={local}
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
        values={quadroKanban}
        onChange={handleQuadroKanbanChange}
        name="quadro-kanban"
        label="Quadro kanban"
        isMulti={false}
      />
      <AnimatableFetchingSelect
        condition={!!quadroKanban}
        optionsEndpoint={endpoints.colunasKanban(quadroKanban?.chave)}
        hasMultiLevelSource={false}
        values={colunaKanban}
        onChange={newValue => updatesOnColunaKanbanChange(newValue as SimpleDocument)}
        refType="colunaKanban"
        name="coluna-kanban"
        label="Coluna kanban"
        isMulti={false}
      />
      <div className="btn-container">
        <Button
          name="criar-tarefa"
          caption="Nova tarefa neste processo..."
          className="btn create-btn"
          onClick={() => {
            if (codigoProcesso) setNewTarefaPanelVisibility({ visible: true, codigoProcesso });
          }}
        />
        <Button name="salvar-tarefa" caption="Salvar alterações" className="btn save-btn" onClick={saveTarefa} />
      </div>
      <footer className="tarefa-card-footer">{}</footer>
    </section>
  );
}
