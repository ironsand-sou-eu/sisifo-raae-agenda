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
import { Prettify, FetchedTarefa, DisplayingTarefa } from "../../global";
import { useFilters } from "./FiltersProvider";
import { useAnimations } from "./AnimationsProvider";
import useTarefasAdapter from "./useTarefasAdapter";
import useProjurisTarefasConnector from "./useProjurisTarefasConnector";

type TarefasListContext = {
  displayingTarefas: DisplayingTarefa[];
  hasMore: boolean;
  isListLoading: boolean;
  loadList?: () => void;
  pageNumber: number;
  selectedTarefas: DisplayingTarefa[];
  setPageNumber: Dispatch<SetStateAction<number>>;
  setTarefas: Dispatch<SetStateAction<FetchedTarefa[]>>;
  toggleCheck: (codigoTarefaEvento: number) => void;
};

const TarefasListContext = createContext<Prettify<TarefasListContext>>({
  displayingTarefas: [],
  hasMore: false,
  isListLoading: false,
  pageNumber: 0,
  selectedTarefas: [],
  setPageNumber: () => {},
  setTarefas: () => {},
  toggleCheck: () => {},
});

export function useTarefasList() {
  return useContext(TarefasListContext);
}

export default function TarefasListProvider({ children }: PropsWithChildren) {
  const [tarefas, setTarefas] = useState<FetchedTarefa[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const { filters } = useFilters();
  const { show } = useAnimations();
  const { fetchTarefasFromFilter } = useProjurisTarefasConnector();
  const { adaptTarefasListToDisplayingType } = useTarefasAdapter();

  useEffect(() => {
    setPageNumber(0);
    setTarefas([]);
    loadList();
  }, [filters?.currentFilter, show?.filter]);

  useEffect(loadList, [pageNumber]);

  const displayingTarefas = useMemo(() => adaptTarefasListToDisplayingType(tarefas), [tarefas]);
  const selectedTarefas = useMemo(() => displayingTarefas?.filter(tarefa => tarefa.checked), [displayingTarefas]);

  function loadList() {
    if (show?.filter || !filters?.currentFilter) return;
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
    loadList,
    pageNumber,
    selectedTarefas,
    setPageNumber,
    setTarefas,
    toggleCheck,
  };

  return <TarefasListContext.Provider value={contextContent}>{children}</TarefasListContext.Provider>;
}
