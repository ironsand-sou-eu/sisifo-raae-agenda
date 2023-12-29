import { Dispatch, SetStateAction } from "react";
import { TarefaRenderingDetails } from "./TarefaDetailedCard";
import TarefaSmallCardHeader from "./TarefaSmallCardHeader";

type TarefaSmallCardProps = {
  setRenderDetails: Dispatch<SetStateAction<TarefaRenderingDetails | undefined>>;
  tarefaDisplayInfo: {
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
    prazoStyle: string;
  };
};

export default function TarefaSmallCard({ tarefaDisplayInfo, setRenderDetails }: TarefaSmallCardProps): JSX.Element {
  const {
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
    prazoStyle,
  } = tarefaDisplayInfo;

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
      <p className={`prazo ${prazoStyle}`}>{`Prazo: ${prazoString} - Situação: ${situacao}`}</p>
      <div className="processo-info">
        {`${parteAtiva} x ${partePassiva} - `}
        <a href={processoUrl}>{numeroProcesso}</a>
      </div>
      <p>Descrição: {descricao}</p>
      <footer className="tarefa-card-footer">{`${usuarioResponsaveis} - ${gruposResponsaveis}`}</footer>
    </section>
  );
}
