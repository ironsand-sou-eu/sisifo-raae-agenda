import { Dispatch, SetStateAction } from "react";
import Cancel from "./Cancel";
import Edit from "./Edit";
import Conclude from "./Conclude";
import { projurisAppBase } from "../../hardcoded";
import useProjurisConnector from "../hooks/useProjurisConnector";
import { TarefaRenderingDetails } from "./TarefaDetailedCard";

type TarefaSmallCardProps = {
  setRenderDetails: Dispatch<SetStateAction<TarefaRenderingDetails | undefined>>;
  tarefaInfo: {
    codigoTarefa: number;
    codigoTarefaEvento: number;
    codigoTarefaTipo: number;
    corTarefaTipo: string;
    descricao: string;
    identificador: string;
    modulo: {
      chave: number;
      valor: string;
    };
    chaveModulo: string;
    nomeTarefaTipo: string;
    usuarioResponsaveis: string;
    gruposResponsaveis: string;
    dataLimite: number;
    dataConclusao?: number | null;
    dataConclusaoPrevista: number;
    horaConclusao?: number | null;
    horaLimite?: number | null;
    codigoSituacao: number;
    situacao: string;
    flagSituacaoConcluida: boolean;
    flagTarefaCompromisso: string;
    numeroComentarios: number;
    numeroProcesso: string;
    parteAtiva: string;
    partePassiva: string;
    identificadorModulo: string;
    dadosResponsaveis: string[];
    clientes: string[];
    diaTodo: boolean;
    dataInclusao: number;
  };
};

function getPrazoStyle(prazo: Date): string {
  if (new Date().toLocaleDateString("pt-BR") === prazo.toLocaleDateString("pt-BR")) return "danger";
  if (new Date().getTime() >= prazo.getTime()) return "lost";
  const daysInMs = 2 * 24 * 60 * 60 * 1000;
  if (new Date().getTime() >= prazo.getTime() - daysInMs) return "warning";
  return "normal";
}

export default function TarefaSmallCard({ tarefaInfo, setRenderDetails }: TarefaSmallCardProps): JSX.Element {
  const { endpoints } = useProjurisConnector();
  const prazo = new Date(tarefaInfo.dataLimite);
  const prazoString = prazo.toLocaleDateString("pt-BR");
  const processoUrl = projurisAppBase + endpoints.processoVisaoCompleta + tarefaInfo.modulo.chave;

  function renderDetails() {
    const { parteAtiva, partePassiva, numeroProcesso } = tarefaInfo;
    const {
      codigoTarefaEvento,
      modulo: { chave: codigoProcesso },
    } = tarefaInfo;
    setRenderDetails({ parteAtiva, partePassiva, numeroProcesso, codigoProcesso, codigoTarefaEvento });
  }

  return (
    <section className="tarefa-card">
      <header className="tarefa-card-titulo">
        <h2 onClick={renderDetails}>{tarefaInfo.nomeTarefaTipo}</h2>
        <div>
          <Cancel
            onClick={e => {
              console.log(e);
            }}
          />
          <Edit
            onClick={e => {
              console.log(e);
            }}
          />
          <Conclude
            onClick={e => {
              console.log(e);
            }}
          />
        </div>
      </header>
      <p className={`prazo ${getPrazoStyle(prazo)}`}>{`Prazo: ${prazoString} - Situação: ${tarefaInfo.situacao}`}</p>
      <div className="processo-info">
        {`${tarefaInfo.parteAtiva} x ${tarefaInfo.partePassiva} - `}
        <a href={processoUrl}>{tarefaInfo.numeroProcesso}</a>
      </div>
      <p>Descrição: {tarefaInfo.descricao}</p>
      <footer className="tarefa-card-footer">{`${tarefaInfo.usuarioResponsaveis} - ${tarefaInfo.gruposResponsaveis}`}</footer>
    </section>
  );
}
