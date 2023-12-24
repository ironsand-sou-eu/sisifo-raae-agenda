import { Dispatch, SetStateAction } from "react";
import { projurisApiBase } from "../../hardcoded";
import useProjurisConnector from "../hooks/useProjurisConnector";
import { TarefaRenderingDetails } from "./TarefaDetailedCard";
import TarefaSmallCardHeader from "./TarefaSmallCardHeader";

type TarefaSmallCardProps = {
  setRenderDetails: Dispatch<SetStateAction<TarefaRenderingDetails | undefined>>;

  tarefaInfo: {
    codigoTarefaEvento: number;
    corTarefaTipo: string;
    dataConclusaoPrevista: number;
    descricao: string;
    flagSituacaoConcluida: boolean;
    gruposResponsaveis: string;
    modulo: {
      chave: number;
    };
    nomeTarefaTipo: string;
    numeroProcesso: string;
    parteAtiva: string;
    partePassiva: string;
    codigoSituacao: number;
    situacao: string;
    usuarioResponsaveis: string;
  };
};

function getPrazoStyle(prazo: Date, flagSituacaoConcluida: boolean): string {
  if (flagSituacaoConcluida) return "done";
  if (new Date().toLocaleDateString("pt-BR") === prazo.toLocaleDateString("pt-BR")) return "danger";
  if (new Date().getTime() >= prazo.getTime()) return "lost";
  const daysInMs = 2 * 24 * 60 * 60 * 1000;
  if (new Date().getTime() >= prazo.getTime() - daysInMs) return "warning";
  return "normal";
}

export default function TarefaSmallCard({ tarefaInfo, setRenderDetails }: TarefaSmallCardProps): JSX.Element {
  const {
    codigoTarefaEvento,
    corTarefaTipo: tarefaColor,
    dataConclusaoPrevista,
    descricao,
    flagSituacaoConcluida,
    gruposResponsaveis,
    modulo: { chave: codigoProcesso },
    nomeTarefaTipo,
    numeroProcesso,
    parteAtiva,
    partePassiva,
    situacao,
    usuarioResponsaveis,
  } = tarefaInfo;

  const { endpoints } = useProjurisConnector();
  const prazo = new Date(dataConclusaoPrevista);
  const prazoString = prazo.toLocaleDateString("pt-BR");
  const processoUrl = projurisApiBase + endpoints.processoVisaoCompleta + codigoProcesso;
  const displayingParteAtiva = !!parteAtiva ? parteAtiva : "Não disponível";
  const displayingPartePassiva = !!partePassiva ? partePassiva : "Não disponível";
  const displayingNumeroProcesso = !!numeroProcesso ? numeroProcesso : "Sem número";
  const displayingGruposResponsaveis = !!gruposResponsaveis ? gruposResponsaveis : "Sem núcleo";

  return (
    <section className="tarefa-card">
      <TarefaSmallCardHeader
        setRenderDetails={setRenderDetails}
        nomeTarefaTipo={nomeTarefaTipo}
        codigoTarefaEvento={codigoTarefaEvento}
        codigoProcesso={codigoProcesso}
        numeroProcesso={numeroProcesso}
        parteAtiva={parteAtiva}
        partePassiva={partePassiva}
        tarefaColor={tarefaColor}
      />
      <p className={`prazo ${getPrazoStyle(prazo, flagSituacaoConcluida)}`}>{`Prazo: ${prazoString} - Situação: ${situacao}`}</p>
      <div className="processo-info">
        {`${displayingParteAtiva} x ${displayingPartePassiva} - `}
        <a href={processoUrl}>{displayingNumeroProcesso}</a>
      </div>
      <p>Descrição: {descricao}</p>
      <footer className="tarefa-card-footer">{`${usuarioResponsaveis} - ${displayingGruposResponsaveis}`}</footer>
    </section>
  );
}
