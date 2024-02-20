import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { DisplayingTarefaDetails, FetchedTarefaDetails, Prettify, SimpleDocument } from "../../../global";
import useTarefasAdapter from "../adapters/useTarefasAdapter";
import useProjurisTarefasConnector, { TarefaUpdateParams } from "../connectors/useProjurisTarefasConnector";

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
  updatesOnColunaKanbanChange: (colunaKanbanNewValue: KanbanValue) => Promise<void>;
  saveTarefa: () => void;
  setTarefaLoadingDetails: Dispatch<SetStateAction<TarefaLoadingDetails>>;
  loadDetails: () => void;
};

const TarefaDetailsContext = createContext<Prettify<TarefaDetailsContext>>({
  isDetailLoading: false,
  updateTarefaDetails: () => {},
  updatesOnColunaKanbanChange: async () => {},
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

  function updateTarefaDetails(keysToUpdate: Partial<FetchedTarefaDetails["tarefaEventoWs"]>): void {
    setTarefaDetails(prevValues => {
      if (!prevValues) return;
      const newTarefaEventoWs = { ...prevValues.tarefaEventoWs, ...keysToUpdate };
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

  const contextContent = {
    displayingTarefaDetails,
    isDetailLoading,
    updateParams,
    loadDetails,
    saveTarefa,
    setTarefaLoadingDetails,
    updatesOnColunaKanbanChange,
    updateTarefaDetails,
  };

  return <TarefaDetailsContext.Provider value={contextContent}>{children}</TarefaDetailsContext.Provider>;
}
