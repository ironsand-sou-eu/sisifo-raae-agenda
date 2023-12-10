import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import useProjurisConnector from "../hooks/useProjurisConnector";
import FetchingSelect from "../micro/FetchingSelect";
import { TarefaDetails } from "../hooks/useProjurisConnector";
import { codigoUsuario } from "../../hardcoded";
import Textarea from "../micro/Textarea";
import ProcessoInfo from "../micro/ProcessoInfoCard";
import TarefaDetailedCardHeader from "./TarefaDetailedCardHeader";
import PrazosCard from "../micro/PrazosCard";
import Button from "../micro/Button";
import tarefaDetailsMock from "../../mocks/tarefa-details-mock";

export type TarefaRenderingDetails = {
  codigoTarefaEvento: number;
  codigoProcesso: number;
  parteAtiva: string;
  partePassiva: string;
  numeroProcesso: string;
  tarefaColor: string;
};

export type TarefaDetailedCardProps = TarefaRenderingDetails & {
  setRenderDetails: Dispatch<SetStateAction<TarefaRenderingDetails | undefined>>;
};

function getPrazoStyle(prazo?: Date): string {
  if (!prazo) return "danger";
  if (new Date().toLocaleDateString("pt-BR") === prazo.toLocaleDateString("pt-BR")) return "danger";
  if (new Date().getTime() >= prazo.getTime()) return "lost";
  const daysInMs = 2 * 24 * 60 * 60 * 1000;
  if (new Date().getTime() >= prazo.getTime() - daysInMs) return "warning";
  return "normal";
}

const TarefaDetailedCard: FunctionComponent<TarefaDetailedCardProps> = ({
  codigoTarefaEvento,
  codigoProcesso,
  parteAtiva,
  partePassiva,
  numeroProcesso,
  tarefaColor,
  setRenderDetails,
}: TarefaDetailedCardProps) => {
  const [tarefaDetails, setTarefaDetails] = useState<TarefaDetails | undefined>(tarefaDetailsMock);
  const {
    tarefaEventoWs: {
      titulo,
      tipoTarefa,
      tarefaEventoSituacaoWs,
      dataConclusao,
      dataConclusaoPrevista,
      dataLimite,
      descricaoTarefa,
      usuariosResponsaveis,
      gruposResponsaveis,
      marcadorWs,
      colunaKanban,
      quadroKanban,
    },
  } = tarefaDetails || { tarefaEventoWs: {} };
  const { fetchTarefaDetails, endpoints } = useProjurisConnector();

  useEffect(() => {
    setTarefaDetails(tarefaDetailsMock);
    // fetchTarefaDetails(codigoTarefaEvento, codigoProcesso)
    //   .then(tarefaDetails => setTarefaDetails(tarefaDetails))
    //   .catch(e => console.error(e));
  }, []);

  return (
    <section className="tarefa-card tarefa-detailed-card">
      <TarefaDetailedCardHeader
        titulo={titulo}
        tipoTarefa={tipoTarefa?.valor}
        setRenderDetails={setRenderDetails}
        tarefaColor={tarefaColor}
      />
      <PrazosCard
        situacao={tarefaEventoSituacaoWs?.situacao}
        dataConclusao={dataConclusao}
        dataConclusaoPrevista={dataConclusaoPrevista}
        dataLimite={dataLimite}
      />
      <ProcessoInfo
        parteAtiva={parteAtiva}
        partePassiva={partePassiva}
        numeroProcesso={numeroProcesso}
        codigoProcessoProjuris={tarefaDetails?.modulos[0].codigoRegistroVinculo}
      />
      <Textarea nameAndId="descricao" label="Descrição" content={descricaoTarefa} />
      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={usuariosResponsaveis}
        name="responsaveis"
        label="Responsáveis"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.gruposTrabalho}
        hasMultiLevelSource={false}
        values={gruposResponsaveis}
        name="grupos-trabalho"
        label="Grupos de trabalho"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.marcadores}
        hasMultiLevelSource={false}
        values={marcadorWs}
        name="marcadores"
        label="Marcadores"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.quadrosKanban(quadroKanban?.chave)}
        hasMultiLevelSource={false}
        values={quadroKanban ? [quadroKanban] : undefined}
        name="quadro-kanban"
        label="Quadro kanban"
        isMulti={false}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.colunasKanban(codigoUsuario)}
        hasMultiLevelSource={false}
        values={colunaKanban ? [colunaKanban] : undefined}
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
