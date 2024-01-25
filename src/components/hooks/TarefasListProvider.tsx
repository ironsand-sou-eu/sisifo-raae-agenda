import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";
import { Prettify, FetchedTarefa, DisplayingTarefa } from "../../global";
import { useFilters } from "./FiltersProvider";
import { useAnimations } from "./AnimationsProvider";
import useProjurisConnector from "./useProjurisConnector";
import useTarefasAdapter from "./useTarefasAdapter";

type TarefasListContext = {
  displayingTarefas: DisplayingTarefa[];
  isListLoading: boolean;
  loadList?: () => void;
  selectedTarefas: DisplayingTarefa[];
  setTarefas: Dispatch<SetStateAction<FetchedTarefa[]>>;
  toggleCheck: (codigoTarefaEvento: number) => void;
};

const TarefasListContext = createContext<Prettify<TarefasListContext>>({
  displayingTarefas: [],
  isListLoading: false,
  selectedTarefas: [],
  setTarefas: () => {},
  toggleCheck: () => {},
});

export function useTarefasList() {
  return useContext(TarefasListContext);
}

export default function TarefasListProvider({ children }: PropsWithChildren) {
  const [tarefas, setTarefas] = useState<FetchedTarefa[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);

  const { filters } = useFilters();
  const { show } = useAnimations();
  const { fetchTarefasFromFilter } = useProjurisConnector();
  const { adaptTarefasListToDisplayingType } = useTarefasAdapter();

  useEffect(loadList, [filters?.currentFilter, show?.filter]);
  const displayingTarefas = useMemo(() => adaptTarefasListToDisplayingType(tarefas), [tarefas]);
  const selectedTarefas = useMemo(() => displayingTarefas?.filter(tarefa => tarefa.checked), [displayingTarefas]);

  function loadList() {
    if (show?.filter || !filters?.currentFilter) return;
    console.log("new list fetch");
    setIsListLoading(true);
    fetchTarefasFromFilter(filters.currentFilter).then(tarefas => {
      setIsListLoading(false);
      setTarefas(tarefas);
    });
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
    isListLoading,
    loadList,
    selectedTarefas,
    setTarefas,
    toggleCheck,
  };

  return <TarefasListContext.Provider value={contextContent}>{children}</TarefasListContext.Provider>;
}
