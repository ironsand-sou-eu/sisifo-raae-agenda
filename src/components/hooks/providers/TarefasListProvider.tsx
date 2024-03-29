import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FetchedTarefa, DisplayingTarefa } from "../../../global";
import { FiltersContext, useFilters } from "./FiltersProvider";
import useTarefasAdapter from "../adapters/useTarefasAdapter";
import useProjurisTarefasConnector from "../connectors/useProjurisTarefasConnector";

export type TarefasListContext = {
  displayingTarefas: DisplayingTarefa[];
  hasMore: boolean;
  isListLoading: boolean;
  loadListFromScratch?: () => void;
  pageNumber: number;
  selectedTarefas: DisplayingTarefa[];
  setPageNumber: Dispatch<SetStateAction<number>>;
  setTarefas: Dispatch<SetStateAction<FetchedTarefa[]>>;
  toggleCheck: (codigoTarefaEvento: number) => void;
  setPreventListLoading: Dispatch<SetStateAction<boolean>>;
};

const TarefasListContext = createContext<TarefasListContext | undefined>(undefined);

export function useTarefasList() {
  return useContext(TarefasListContext);
}

export default function TarefasListProvider({ children }: PropsWithChildren) {
  const [tarefas, setTarefas] = useState<FetchedTarefa[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [preventLoading, setPreventListLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const { filters } = useFilters() as FiltersContext;
  const { fetchTarefasFromFilter } = useProjurisTarefasConnector();
  const { adaptTarefasListToDisplayingType } = useTarefasAdapter();

  useEffect(() => {
    loadListFromScratch();
  }, [filters?.currentFilter, preventLoading]);

  useEffect(loadList, [pageNumber]);

  const displayingTarefas = useMemo(() => adaptTarefasListToDisplayingType(tarefas), [tarefas]);
  const selectedTarefas = useMemo(() => displayingTarefas?.filter(tarefa => tarefa.checked), [displayingTarefas]);

  function loadListFromScratch() {
    setPageNumber(0);
    setTarefas([]);
    loadList();
  }

  function loadList() {
    if (preventLoading || !filters?.currentFilter) return;
    setIsListLoading(true);
    fetchTarefasFromFilter(filters.currentFilter, pageNumber)
      .then(newTarefas => {
        setIsListLoading(false);
        setHasMore(newTarefas.length > 0);
        setTarefas(prevTarefas => [...prevTarefas, ...newTarefas]);
      })
      .catch(e => console.error(e));
  }

  function toggleCheck(codigoTarefaEvento: number) {
    setTarefas(prevValues => {
      if (!prevValues) return [];
      const index = prevValues?.findIndex(tarefa => tarefa.codigoTarefaEvento === codigoTarefaEvento);
      const clone = structuredClone(prevValues);
      clone[index].checked = !clone[index].checked;
      return clone;
    });
  }

  const contextContent = {
    displayingTarefas,
    hasMore,
    isListLoading,
    loadListFromScratch,
    pageNumber,
    selectedTarefas,
    setPageNumber,
    setTarefas,
    toggleCheck,
    setPreventListLoading,
  };

  return <TarefasListContext.Provider value={contextContent}>{children}</TarefasListContext.Provider>;
}
