import { useEffect, useState } from "react";
import useProjurisConnector from "./useProjurisConnector";
import { DisplayingTarefaDetails, FetchedTarefaDetails, SimpleDocument } from "../../global";
import useTarefasAdapter from "./useTarefasAdapter";

export default function useTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number, tarefaColor: string) {
  const [tarefaDetails, setTarefaDetails] = useState<FetchedTarefaDetails>();
  const [displayingTarefaDetails, setDisplayingTarefaDetails] = useState<DisplayingTarefaDetails>();
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const { fetchTarefaDetails, dispatchBackendTarefaUpdate } = useProjurisConnector();
  const { adaptTarefaDetailsToDisplayingType, adaptTarefaDetailsToWritingType } = useTarefasAdapter();

  useEffect(loadDetails, [codigoTarefaEvento, codigoProcesso]);

  useEffect(() => {
    if (!tarefaDetails) return;
    setDisplayingTarefaDetails(() => {
      const dispdetails = adaptTarefaDetailsToDisplayingType(tarefaDetails, tarefaColor);
      return dispdetails;
    });
  }, [tarefaDetails]);

  type KanbanValue = SimpleDocument & { situacao?: SimpleDocument };

  async function updatesOnColunaKanbanChange(colunaKanbanNewValue: KanbanValue) {
    const situacao = colunaKanbanNewValue.situacao;
    const colunaKanban = { ...colunaKanbanNewValue };
    delete colunaKanban.situacao;
    updateTarefaDetails({
      colunaKanban,
      tarefaEventoSituacaoWs: {
        codigoTarefaEventoSituacao: situacao?.chave,
        situacao: situacao?.valor,
      },
    });
  }

  function updateTarefaDetails(newProps: Partial<FetchedTarefaDetails["tarefaEventoWs"]>): void {
    setTarefaDetails(prevValues => {
      if (!prevValues) return;
      const newTarefaEventoWs = { ...prevValues.tarefaEventoWs, ...newProps };
      return { ...prevValues, tarefaEventoWs: newTarefaEventoWs };
    });
  }

  function saveTarefa() {
    if (!tarefaDetails) return;
    const writeAdaptedTarefaDetails = adaptTarefaDetailsToWritingType(tarefaDetails);
    dispatchBackendTarefaUpdate({
      type: "salvar",
      name: writeAdaptedTarefaDetails.titulo ?? "",
      reloadFunction: loadDetails,
      tarefa: writeAdaptedTarefaDetails,
    });
  }

  function loadDetails() {
    setIsDetailLoading(true);
    fetchTarefaDetails(codigoTarefaEvento, codigoProcesso)
      .then(details => {
        setTarefaDetails(details);
      })
      .catch(e => console.error(e))
      .finally(() => setIsDetailLoading(false));
  }

  return {
    displayingTarefaDetails,
    isDetailLoading,
    updateTarefaDetails,
    updatesOnColunaKanbanChange,
    saveTarefa,
    loadDetails,
  };
}
