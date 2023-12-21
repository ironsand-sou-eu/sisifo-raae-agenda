import { MouseEventHandler, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { SimpleDocument, SituacaoTarefa } from "./useProjurisConnector";
import { filterMock } from "../../mocks/filter-mocks";
import { areObjectsEqual } from "../../utils/utils";

export type Filter = {
  categoria: "TAREFA" | "ANDAMENTO" | "TIMESHEET";
  index: number;
  filterName: string;
  quadroKanban?: Prettify<SimpleDocument>;
  colunaKanban?: Prettify<SimpleDocument>;
  tipos?: Prettify<SimpleDocument>[];
  responsaveis?: Prettify<SimpleDocument>[];
  gruposTrabalho?: Prettify<SimpleDocument>[];
  situacoes?: Prettify<SituacaoTarefa>[];
  dates?: Date[];
  nextXDays?: number;
};

type FiltersStructure = {
  currentFilter?: Prettify<Filter>;
  savedFilters: Prettify<Filter>[];
};

const minimalCurrentFilter: Filter = { index: -1, filterName: "", categoria: "TAREFA" };

const minimalTarefaFilter: FiltersStructure = {
  currentFilter: minimalCurrentFilter,
  savedFilters: [],
};

type TFiltersContext = {
  filters: FiltersStructure | undefined;
  promptAddingFilter: MouseEventHandler<HTMLDivElement>;
  promptDeletingFilter: MouseEventHandler<HTMLDivElement>;
  applySelectedFilter: (filter: Filter) => void;
  changeCurrentFilter: (newValue: any, action: keyof Filter) => void;
};

const FiltersContext = createContext<TFiltersContext>({
  filters: undefined,
  promptAddingFilter: () => {},
  promptDeletingFilter: () => {},
  applySelectedFilter: () => {},
  changeCurrentFilter: () => {},
});

export function useFilters() {
  return useContext(FiltersContext);
}

export default function FiltersProvider({ children }: PropsWithChildren) {
  const [filters, setFilters] = useState<Prettify<FiltersStructure> | undefined>();

  useEffect(() => {
    // const retrievedString = localStorage.getItem("filters"); //chrome.storage.local.get(currentFilter);
    // const retrieved = retrievedString === "undefined" ? undefined : retrievedString;
    // const retrievedFilters = JSON.parse(retrieved ?? JSON.stringify(minimalTarefaFilter));
    setFilters({ currentFilter: undefined, savedFilters: filterMock });
  }, []);

  useEffect(() => {
    console.log({ filters });
    localStorage.setItem("filters", JSON.stringify(filters));
    // chrome.storage.local.set({ currentFilter });
  }, [filters]);

  function promptAddingFilter() {
    const savedFilterEqualToCurrent = filters?.savedFilters.find(savedFilter => {
      return areObjectsEqual(filters.currentFilter, savedFilter, ["index", "filterName"]);
    });
    if (savedFilterEqualToCurrent) {
      alert(`O filtro atual já está salvo, com o nome "${savedFilterEqualToCurrent.filterName}".`);
      return;
    }
    const userResp = prompt("Digite um nome para o novo filtro:");
    if (!userResp) {
      alert(`Operação cancelada.`);
      return;
    }
    const newFilter: Filter = structuredClone(filters?.currentFilter!);
    newFilter.index = getFirstAvailableIndex();
    newFilter.filterName = userResp;
    addSavedFilter(newFilter);
  }

  function getFirstAvailableIndex() {
    const savedFiltersAmount = filters?.savedFilters.length ?? 0;
    if (savedFiltersAmount === 0) return 0;
    for (let i = 0; i < savedFiltersAmount; i++) {
      if (!filters?.savedFilters.some(savedFilter => savedFilter.index === i)) return i;
    }
    return savedFiltersAmount;
  }

  function addSavedFilter(filterToAdd: Filter): void {
    setFilters(currentFilters => {
      if (!currentFilters) {
        const minimalFilter = structuredClone(minimalTarefaFilter);
        minimalFilter.savedFilters.push(filterToAdd);
        return minimalFilter;
      }

      currentFilters.savedFilters.push(filterToAdd);
      return { ...currentFilters, currentFilter: filterToAdd };
    });
  }

  function promptDeletingFilter() {
    const userResp = confirm("Tem certeza de que deseja excluir o filtro?");
    if (!userResp) {
      alert(`Operação cancelada.`);
      return;
    }
    deleteSavedFilter(filters!.currentFilter!.index);
  }

  function deleteSavedFilter(indexToDelete: number): void {
    setFilters(currentFilters => {
      const savedFilters = filters?.savedFilters ?? [];
      const newSavedFilters = savedFilters.filter(savedFilter => savedFilter.index !== indexToDelete);
      return { currentFilter: currentFilters?.currentFilter, savedFilters: newSavedFilters };
    });
  }

  function applySelectedFilter(filter: Filter): void {
    setFilters(previousFiltersValues => {
      if (!previousFiltersValues) return { currentFilter: filter, savedFilters: [] };
      return { ...previousFiltersValues, currentFilter: filter };
    });
  }

  function changeCurrentFilter(newValue: any, action: keyof Filter): void {
    const newFilter: Filter = filters?.currentFilter ? structuredClone(filters?.currentFilter) : minimalCurrentFilter;
    switch (action) {
      case "dates":
        delete newFilter.nextXDays;
        newFilter.dates = newValue;
        break;
      case "nextXDays":
        delete newFilter.dates;
        newFilter[action] = newValue;
        break;
      case "categoria":
      case "quadroKanban":
      case "colunaKanban":
      case "gruposTrabalho":
      case "responsaveis":
      case "situacoes":
      case "tipos":
        newFilter[action] = newValue;
    }

    setFilters(previousFiltersValues => {
      if (!previousFiltersValues) return { currentFilter: newFilter, savedFilters: [] };
      return { ...previousFiltersValues, currentFilter: newFilter };
    });
  }

  const contextContent = {
    filters,
    promptAddingFilter,
    promptDeletingFilter,
    applySelectedFilter,
    changeCurrentFilter,
  };

  return <FiltersContext.Provider value={contextContent}>{children}</FiltersContext.Provider>;
}
