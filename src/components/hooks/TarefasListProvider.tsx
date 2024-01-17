import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { Prettify, Tarefa } from "../../global";
import { useFilters } from "./FiltersProvider";
import { useAnimations } from "./AnimationsProvider";
import useProjurisConnector from "./useProjurisConnector";

type TarefasListContext = {
  tarefas: Tarefa[];
  setTarefas: Dispatch<SetStateAction<Tarefa[]>>;
  isListLoading: boolean;
};

const TarefasListContext = createContext<Prettify<TarefasListContext>>({
  tarefas: [],
  setTarefas: () => {},
  isListLoading: false,
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

  useEffect(() => {
    if (show?.filter || !filters?.currentFilter) return;
    console.log("new fetch");
    setIsListLoading(true);
    fetchTarefasFromFilter(filters.currentFilter).then(tarefas => {
      setIsListLoading(false);
      setTarefas(tarefas);
    });
  }, [filters?.currentFilter, show?.filter]);

  const contextContent = {
    tarefas,
    setTarefas,
    isListLoading,
  };

  return <TarefasListContext.Provider value={contextContent}>{children}</TarefasListContext.Provider>;
}
