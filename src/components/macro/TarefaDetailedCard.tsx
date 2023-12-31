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
import useFetchedTarefasAdapter from "../hooks/useTarefasAdapter";
import TarefaDetailedCardSkeleton from "./skeletons/TarefaDetailedCardSkeleton";

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
  const { tarefaDetails, isDetailLoading } = useTarefaDetails(codigoTarefaEvento, codigoProcesso);
  const { adaptFetchedTarefaDetails } = useFetchedTarefasAdapter();

  const {
    displayTitulo,
    situacao,
    codigoProcessoProjuris,
    processoUrl,
    descricaoTarefa,
    usuariosResponsaveis,
    gruposResponsaveis,
    marcadorWs,
    colunaKanban,
    quadroKanban,
    prazoAdmString,
    prazoFatalString,
    dataConclusaoString,
    prazoStyle,
  } = adaptFetchedTarefaDetails(tarefaDetails, tarefaColor);

  return isDetailLoading ? (
    <TarefaDetailedCardSkeleton />
  ) : (
    <section className="card tarefa-card tarefa-detailed-card">
      <TarefaDetailedCardHeader {...{ displayTitulo, setPrefetchDetails, tarefaColor }} />
      <PrazosCard {...{ situacao, prazoAdmString, prazoFatalString, dataConclusaoString, prazoStyle }} />
      <ProcessoInfo {...{ parteAtiva, partePassiva, numeroProcesso, processoUrl }} />
      <Textarea nameAndId="descricao" label="Descrição" content={descricaoTarefa} />
      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={usuariosResponsaveis}
        onChange={() => {}}
        name="responsaveis"
        label="Responsáveis"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.gruposTrabalho}
        hasMultiLevelSource={false}
        values={gruposResponsaveis}
        onChange={() => {}}
        name="grupos-trabalho"
        label="Grupos de trabalho"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.marcadores}
        hasMultiLevelSource={false}
        values={marcadorWs}
        onChange={() => {}}
        name="marcadores"
        label="Marcadores"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.quadrosKanban(codigoUsuario)}
        hasMultiLevelSource={false}
        values={quadroKanban ? [quadroKanban] : undefined}
        onChange={() => {}}
        name="quadro-kanban"
        label="Quadro kanban"
        isMulti={false}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.colunasKanban(quadroKanban?.chave)}
        hasMultiLevelSource={false}
        values={colunaKanban ? [colunaKanban] : undefined}
        onChange={() => {}}
        name="coluna-kanban"
        label="Coluna kanban"
        isMulti={false}
      />
      <Button name="salvar" onClick={() => {}} />
      <footer className="tarefa-card-footer">{}</footer>
    </section>
  );
};

export default TarefaDetailedCard;
