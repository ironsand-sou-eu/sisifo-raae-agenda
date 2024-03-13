import { Dispatch, SetStateAction } from "react";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import TarefaSmallCardHeader from "./TarefaSmallCardHeader";
import { DisplayingTarefa } from "../../../global";
import useTarefasAdapter from "../../hooks/adapters/useTarefasAdapter";
import { TarefasListContext, useTarefasList } from "../../hooks/providers/TarefasListProvider";

type TarefaSmallCardProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  tarefaDisplayInfo: DisplayingTarefa;
};

export default function TarefaSmallCard({ tarefaDisplayInfo, setPrefetchDetails }: TarefaSmallCardProps): JSX.Element {
  const { adaptTarefasListToUpdatingParams } = useTarefasAdapter();
  const { loadListFromScratch } = useTarefasList() as TarefasListContext;
  const updateParams = adaptTarefasListToUpdatingParams(tarefaDisplayInfo, "cancelar", loadListFromScratch)[0];
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
    prazo,
    processoUrl,
    prazoColorCssVariable,
  } = tarefaDisplayInfo;

  return (
    <section className="card tarefa-card">
      <TarefaSmallCardHeader
        {...{
          checked,
          nomeTarefaTipo,
          codigoTarefaEvento,
          codigoProcesso,
          numeroProcesso,
          parteAtiva,
          partePassiva,
          tarefaColor,
          updateParams,
        }}
        setPrefetchDetails={setPrefetchDetails}
      />
      <p
        className={`prazo`}
        style={{ backgroundColor: `var(${prazoColorCssVariable})` }}
      >{`Prazo: ${prazo} - Situação: ${situacao}`}</p>
      <div className="processo-info">
        {`${parteAtiva} x ${partePassiva} - `}
        <a target="_blank" href={processoUrl}>
          {numeroProcesso}
        </a>
      </div>
      <p>Descrição: {descricao}</p>
      <footer className="tarefa-card-footer">{`${usuarioResponsaveis} - ${gruposResponsaveis}`}</footer>
    </section>
  );
}
