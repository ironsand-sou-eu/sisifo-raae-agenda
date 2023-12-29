import { useEffect, useState } from "react";
import { Tarefa } from "../../global";
import { useFilters } from "./FiltersProvider";
import { useFilterAnimations } from "./FilterAnimationsProvider";
import useProjurisConnector from "./useProjurisConnector";

export default function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { filters } = useFilters();
  const { showFilter } = useFilterAnimations();
  const { fetchTarefasFromFilter } = useProjurisConnector();

  useEffect(() => {
    if (!showFilter && filters?.currentFilter) {
      setIsLoading(true);
      fetchTarefasFromFilter(filters.currentFilter).then(tarefas => {
        setIsLoading(false);
        setTarefas(tarefas);
      });
    }
  }, [filters?.currentFilter, showFilter]);

  return { tarefas, isLoading };
}
