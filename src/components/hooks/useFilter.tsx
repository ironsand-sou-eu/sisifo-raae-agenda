import { useState, useEffect, useMemo } from "react";
import { SimpleDocument, SituacaoTarefa } from "./useProjurisConnector";

export type Filter = {
  categoria: "TAREFA" | "ANDAMENTO" | "TIMESHEET";
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
  currentFilter: { filterName: "current", categoria: "TAREFA" },
  savedFilters: [],
};

export default function useFilter() {
  const [filters, setFilters] = useState<Prettify<FiltersStructure> | undefined>();

  useEffect(() => {
    const retrievedString = localStorage.getItem("filters"); //chrome.storage.local.get(currentFilter);
    const retrieved = retrievedString === "undefined" ? undefined : retrievedString;
    const retrievedFilters = JSON.parse(retrieved ?? JSON.stringify(minimalTarefaFilter));
    console.log("Retrieved from storage: ", retrievedFilters);
    setFilters(retrievedFilters);
  }, []);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
    // chrome.storage.local.set({ currentFilter });
  }, [filters]);

  function addSavedFilter(filterToAdd: Filter) {
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

  function deleteSavedFilter(indexToDelete: number) {
    setFilters(currentFilters => {
      const savedFilters = filters?.savedFilters ?? [];
      const newSavedFilters = savedFilters.filter((_, index) => index !== indexToDelete);
      return { currentFilter: currentFilters?.currentFilter, savedFilters: newSavedFilters };
    });
  }

  function applyFilter(filter: Filter) {
    setFilters(currentFilters => {
      if (!currentFilters) {
        const newFilters = structuredClone(minimalTarefaFilter);
        newFilters.currentFilter = filter;
        return newFilters;
      }
      return { ...currentFilters, currentFilter: filter };
    });
  }

  return { filters, addSavedFilter, deleteSavedFilter, applyFilter };
}
