import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { SimpleDocument, SituacaoTarefa } from "./useProjurisConnector";
import filterMock from "../../mocks/filter-mocks";

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
  startDate?: Date;
  endDate?: Date;
};

type FiltersStructure = {
  currentFilter?: Prettify<Filter>;
  savedFilters: Prettify<Filter>[];
};

const minimalTarefaFilter: FiltersStructure = {
  currentFilter: { index: -1, filterName: "", categoria: "TAREFA" },
  savedFilters: [],
};

type TFiltersContext = {
  filters: FiltersStructure | undefined;
  addSavedFilter: (filterToAdd: Filter) => void;
  deleteSavedFilter: (indexToDelete: number) => void;
  applyFilter: (filter: Filter) => void;
};

const FiltersContext = createContext<TFiltersContext>({
  filters: undefined,
  addSavedFilter: () => {},
  deleteSavedFilter: () => {},
  applyFilter: () => {},
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
    // console.log("Retrieved from storage: ", retrievedFilters);
    setFilters({ currentFilter: undefined, savedFilters: filterMock });
  }, []);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
    // chrome.storage.local.set({ currentFilter });
  }, [filters]);

  function addSavedFilter(filterToAdd: Filter): void {
    setFilters(currentFilters => {
      if (!currentFilters) {
        const minimalFilter = structuredClone(minimalTarefaFilter);
        minimalFilter.savedFilters.push(filterToAdd);
        return minimalFilter;
      }
      currentFilters.savedFilters.push(filterToAdd);
      return currentFilters;
    });
  }

  function deleteSavedFilter(indexToDelete: number): void {
    setFilters(currentFilters => {
      const savedFilters = filters?.savedFilters ?? [];
      const newSavedFilters = savedFilters.filter((_, index) => index !== indexToDelete);
      return { currentFilter: currentFilters?.currentFilter, savedFilters: newSavedFilters };
    });
  }

  function applyFilter(filter: Filter): void {
    setFilters(previousFiltersValues => {
      if (!previousFiltersValues) return { currentFilter: filter, savedFilters: [] };
      return { ...previousFiltersValues, currentFilter: filter };
    });
  }

  const contextContent = {
    filters,
    addSavedFilter,
    deleteSavedFilter,
    applyFilter,
  };

  return <FiltersContext.Provider value={contextContent}>{children}</FiltersContext.Provider>;
}
