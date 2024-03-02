import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { DisplayingTarefaDetails, FetchedTarefaDetails, Prettify, SimpleDocument } from "../../../global";
import useTarefasAdapter from "../adapters/useTarefasAdapter";
import useProjurisTarefasConnector, { TarefaUpdateParams } from "../connectors/useProjurisTarefasConnector";
import { useTarefasList } from "./TarefasListProvider";

type KanbanValue = SimpleDocument & { situacao?: SimpleDocument };

type TarefaLoadingDetails = {
  codigoTarefaEvento: number;
  codigoProcesso: number;
  tarefaColor: string;
};

type TarefaDetailsContext = {
  displayingTarefaDetails?: DisplayingTarefaDetails;
  isDetailLoading: boolean;
  updateParams?: TarefaUpdateParams;
  updateTarefaDetails: (keysToUpdate: Partial<FetchedTarefaDetails["tarefaEventoWs"]>) => void;
  saveTarefa: () => void;
  setTarefaLoadingDetails: Dispatch<SetStateAction<TarefaLoadingDetails>>;
  loadDetails: () => void;
};

const TarefaDetailsContext = createContext<Prettify<TarefaDetailsContext>>({
  isDetailLoading: false,
  updateTarefaDetails: () => {},
  saveTarefa: () => {},
  setTarefaLoadingDetails: () => {},
  loadDetails: () => {},
});

const emptyLoadingDetails: TarefaLoadingDetails = {
  codigoTarefaEvento: 0,
  codigoProcesso: 0,
  tarefaColor: "",
};

export function useTarefaDetails() {
  return useContext(TarefaDetailsContext);
}

export default function TarefaDetailsProvider({ children }: PropsWithChildren) {
  const [tarefaDetails, setTarefaDetails] = useState<FetchedTarefaDetails>();
  const [displayingTarefaDetails, setDisplayingTarefaDetails] = useState<DisplayingTarefaDetails>();
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [tarefaLoadingDetails, setTarefaLoadingDetails] = useState(emptyLoadingDetails);

  const { fetchTarefaDetails, dispatchBackendTarefaUpdate } = useProjurisTarefasConnector();
  const { adaptTarefaDetailsToDisplayingType, adaptTarefaDetailsToWritingType } = useTarefasAdapter();
  const { adaptTarefaDetailsToUpdatingParams } = useTarefasAdapter();
  const { loadListFromScratch } = useTarefasList();

  useEffect(loadDetails, [tarefaLoadingDetails.codigoTarefaEvento, tarefaLoadingDetails.codigoProcesso]);

  useEffect(() => {
    if (!tarefaDetails) return;
    setDisplayingTarefaDetails(() =>
      adaptTarefaDetailsToDisplayingType(tarefaDetails, tarefaLoadingDetails.tarefaColor)
    );
  }, [tarefaDetails]);

  const updateParams = displayingTarefaDetails
    ? adaptTarefaDetailsToUpdatingParams(
        displayingTarefaDetails,
        tarefaLoadingDetails.codigoTarefaEvento,
        "cancelar",
        loadDetails
      )
    : undefined;

  function loadDetails() {
    if (!tarefaLoadingDetails.codigoTarefaEvento || !tarefaLoadingDetails.codigoProcesso) return;
    setIsDetailLoading(true);
    fetchTarefaDetails(tarefaLoadingDetails.codigoTarefaEvento, tarefaLoadingDetails.codigoProcesso)
      .then(details => {
        setTarefaDetails(details);
      })
      .catch(e => console.error(e))
      .finally(() => setIsDetailLoading(false));
  }

  function updateTarefaDetails(keysToUpdate: Partial<FetchedTarefaDetails["tarefaEventoWs"]>): void {
    const adaptedKeys = handleKeysToUpdate(keysToUpdate);
    setTarefaDetails(prevValues => {
      if (!prevValues) return;
      const newTarefaEventoWs = { ...prevValues.tarefaEventoWs, ...adaptedKeys };
      return { ...prevValues, tarefaEventoWs: newTarefaEventoWs };
    });
  }

  function handleKeysToUpdate(
    keysToUpdate: Partial<FetchedTarefaDetails["tarefaEventoWs"]>
  ): Partial<FetchedTarefaDetails["tarefaEventoWs"]> {
    let result = structuredClone(keysToUpdate);
    if (Object.keys(keysToUpdate).includes("colunaKanban"))
      result = { ...result, ...adaptColunaKanbanBeforeUpdating(result.colunaKanban) };
    if (Object.keys(result).includes("quadroKanban"))
      result = { ...result, ...adaptQuadroKanbanBeforeUpdating(result.quadroKanban) };
    return result;
  }

  function adaptColunaKanbanBeforeUpdating(
    newColunaKanbanValue: KanbanValue | null
  ): Partial<FetchedTarefaDetails["tarefaEventoWs"]> {
    if (!newColunaKanbanValue) return { colunaKanban: null };
    const situacao = newColunaKanbanValue.situacao;
    const colunaKanban = { ...newColunaKanbanValue };
    delete colunaKanban.situacao;
    return {
      colunaKanban,
      tarefaEventoSituacaoWs: {
        codigoTarefaEventoSituacao: situacao?.chave,
        situacao: situacao?.valor,
      },
    };
  }

  function adaptQuadroKanbanBeforeUpdating(newQuadroKanbanValue: SimpleDocument | null) {
    if (!newQuadroKanbanValue) return { quadroKanban: newQuadroKanbanValue, colunaKanban: null };
    return { quadroKanban: newQuadroKanbanValue };
  }

  function reloadDetailsAndList() {
    loadDetails();
    if (loadListFromScratch) loadListFromScratch();
  }

  function saveTarefa() {
    if (!tarefaDetails) return;
    const writeAdaptedTarefaDetails = adaptTarefaDetailsToWritingType(tarefaDetails);
    dispatchBackendTarefaUpdate({
      type: "salvar",
      name: writeAdaptedTarefaDetails.titulo ?? "",
      reloadFunction: reloadDetailsAndList,
      tarefa: writeAdaptedTarefaDetails,
    });
  }

  const contextContent = {
    displayingTarefaDetails,
    isDetailLoading,
    updateParams,
    loadDetails,
    saveTarefa,
    setTarefaLoadingDetails,
    updateTarefaDetails,
  };

  return <TarefaDetailsContext.Provider value={contextContent}>{children}</TarefaDetailsContext.Provider>;
}
