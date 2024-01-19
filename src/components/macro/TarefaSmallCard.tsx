import { Dispatch, SetStateAction } from "react";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import TarefaSmallCardHeader from "./TarefaSmallCardHeader";

type TarefaSmallCardProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  tarefaDisplayInfo: {
    checked?: boolean;
    codigoTarefaEvento: number;
    tarefaColor: string;
    dataConclusaoPrevista: number;
    descricao: string;
    gruposResponsaveis: string;
    codigoProcesso: number;
    nomeTarefaTipo: string;
    numeroProcesso: string;
    parteAtiva: string;
    partePassiva: string;
    situacao: string;
    usuarioResponsaveis: string;
    prazoString: string;
    processoUrl: string;
    prazoColorCssVariable: string;
  };
};

export default function TarefaSmallCard({ tarefaDisplayInfo, setPrefetchDetails }: TarefaSmallCardProps): JSX.Element {
  const {
    checked,
    codigoTarefaEvento,
    tarefaColor,
    descricao,
    gruposResponsaveis,
    codigoProcesso,
    nomeTarefaTipo,
    numeroProcesso,
    parteAtiva,
    partePassiva,
    situacao,
    usuarioResponsaveis,
    prazoString,
    processoUrl,
    prazoColorCssVariable,
  } = tarefaDisplayInfo;

  return (
    <section className="card tarefa-card">
      <TarefaSmallCardHeader
        {...{ checked, nomeTarefaTipo, codigoTarefaEvento, codigoProcesso, numeroProcesso, parteAtiva, partePassiva, tarefaColor }}
        setPrefetchDetails={setPrefetchDetails}
      />
      <p className={`prazo`} style={{ backgroundColor: `var(${prazoColorCssVariable})` }}>{`Prazo: ${prazoString} - Situação: ${situacao}`}</p>
      <div className="processo-info">
        {`${parteAtiva} x ${partePassiva} - `}
        <a href={processoUrl}>{numeroProcesso}</a>
      </div>
      <p>Descrição: {descricao}</p>
      <footer className="tarefa-card-footer">{`${usuarioResponsaveis} - ${gruposResponsaveis}`}</footer>
    </section>
  );
}
