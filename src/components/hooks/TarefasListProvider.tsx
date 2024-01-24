import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";
import { Prettify, Tarefa } from "../../global";
import { useFilters } from "./FiltersProvider";
import { useAnimations } from "./AnimationsProvider";
import useProjurisConnector from "./useProjurisConnector";

type TarefasListContext = {
  isListLoading: boolean;
  loadList?: () => void;
  tarefas: Tarefa[];
  setTarefas: Dispatch<SetStateAction<Tarefa[]>>;
  selectedTarefas: Tarefa[];
};

const TarefasListContext = createContext<Prettify<TarefasListContext>>({
  isListLoading: false,
  tarefas: [],
  setTarefas: () => {},
  selectedTarefas: [],
});

export function useTarefasList() {
  return useContext(TarefasListContext);
}

export default function TarefasListProvider({ children }: PropsWithChildren) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);

  const { filters } = useFilters();
  const { show } = useAnimations();
  const { fetchTarefasFromFilter } = useProjurisConnector();
  const selectedTarefas = useMemo(() => tarefas?.filter(tarefa => tarefa.checked), [tarefas]);

  useEffect(loadList, [filters?.currentFilter, show?.filter]);

  function loadList() {
    if (show?.filter || !filters?.currentFilter) return;
    console.log("new list fetch");
    setIsListLoading(true);
    fetchTarefasFromFilter(filters.currentFilter).then(tarefas => {
      setIsListLoading(false);
      setTarefas(tarefas);
    });
  }

  const contextContent = {
    isListLoading,
    loadList,
    tarefas,
    setTarefas,
    selectedTarefas,
  };

  return <TarefasListContext.Provider value={contextContent}>{children}</TarefasListContext.Provider>;
}
