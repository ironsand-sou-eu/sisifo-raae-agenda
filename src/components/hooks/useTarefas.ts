import { useEffect, useState } from "react";
import { Tarefa } from "../../global";
import { useFilters } from "./FiltersProvider";
import { useFilterAnimations } from "./FilterAnimationsProvider";
import useProjurisConnector from "./useProjurisConnector";
import { useLoading } from "./LoadingProvider";

export default function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>();
  const { setIsLoading } = useLoading();
  const { filters } = useFilters();
  const { showFilter } = useFilterAnimations();
  const { fetchTarefasFromFilter } = useProjurisConnector();

  useEffect(() => {
    if (!showFilter && filters?.currentFilter) {
      setIsLoading(prevValues => {
        return { ...prevValues, loadingList: true };
      });
      fetchTarefasFromFilter(filters.currentFilter).then(tarefas => {
        setIsLoading(prevValues => {
          return { ...prevValues, loadingList: false };
        });
        setTarefas(tarefas);
      });
    }
  }, [filters?.currentFilter, showFilter]);

  return { tarefas };
}
