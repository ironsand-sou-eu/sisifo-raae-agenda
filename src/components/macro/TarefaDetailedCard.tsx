import { Dispatch, FunctionComponent, SetStateAction } from "react";
import useProjurisConnector from "../hooks/useProjurisConnector";
import FetchingSelect from "../micro/FetchingSelect";
import { codigoUsuario } from "../../hardcoded";
import Textarea from "../micro/Textarea";
import ProcessoInfo from "../micro/ProcessoInfoCard";
import TarefaDetailedCardHeader from "./TarefaDetailedCardHeader";
import PrazosCard from "../micro/PrazosCard";
import Button from "../micro/Button";
import useTarefaDetails from "../hooks/useTarefaDetails";
import TarefaDetailedCardSkeleton from "./skeletons/TarefaDetailedCardSkeleton";
import { useAnimations } from "../hooks/AnimationsProvider";
import AnimatableFetchingSelect from "../micro/AnimatableFetchingSelect";

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

const TarefaDetailedCard: FunctionComponent<TarefaDetailedCardProps> = ({
  codigoTarefaEvento,
  codigoProcesso,
  parteAtiva,
  partePassiva,
  numeroProcesso,
  tarefaColor,
  setPrefetchDetails,
}: TarefaDetailedCardProps) => {
  const { endpoints } = useProjurisConnector();
  const { displayingTarefaDetails, isDetailLoading, updateTarefaDetails, saveTarefa } = useTarefaDetails(
    codigoTarefaEvento,
    codigoProcesso,
    tarefaColor
  );
  const { setHidingAnimation } = useAnimations();
  const {
    displayTitulo,
    situacao,
    codigoProcessoProjuris,
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
  } = displayingTarefaDetails ?? {};

  function handleQuadroKanbanChange(newValue: unknown) {
    if (!newValue) {
      setHidingAnimation("colunaKanban", () => updateTarefaDetails("quadroKanban", newValue));
    } else {
      updateTarefaDetails("quadroKanban", newValue);
    }
  }

  return isDetailLoading ? (
    <TarefaDetailedCardSkeleton />
  ) : (
    <section className="card tarefa-card tarefa-detailed-card">
      <TarefaDetailedCardHeader {...{ displayTitulo, setPrefetchDetails, tarefaColor }} />
      <PrazosCard
        {...{ dataConclusao, dataConclusaoPrevista, dataLimite }}
        onChange={updateTarefaDetails}
        prazoColorCssVariable={prazoColorCssVariable ?? ""}
      />
      <ProcessoInfo {...{ parteAtiva, partePassiva, numeroProcesso, processoUrl }} />
      <Textarea
        nameAndId="descricao"
        label="Descrição"
        onChange={newValue => updateTarefaDetails("descricaoTarefa", newValue)}
        content={descricaoTarefa}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={usuariosResponsaveis}
        onChange={newValue => updateTarefaDetails("usuariosResponsaveis", newValue)}
        name="responsaveis"
        label="Responsáveis"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.gruposTrabalho}
        hasMultiLevelSource={false}
        values={gruposResponsaveis}
        onChange={newValue => updateTarefaDetails("gruposResponsaveis", newValue)}
        name="grupos-trabalho"
        label="Grupos de trabalho"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.marcadores}
        hasMultiLevelSource={false}
        values={marcadorWs}
        onChange={newValue => updateTarefaDetails("marcadorWs", newValue)}
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
        onChange={newValue => updateTarefaDetails("colunaKanban", newValue)}
        name="coluna-kanban"
        label="Coluna kanban"
        isMulti={false}
      />
      <Button name="salvar" onClick={saveTarefa} />
      <footer className="tarefa-card-footer">{}</footer>
    </section>
  );
};

export default TarefaDetailedCard;
