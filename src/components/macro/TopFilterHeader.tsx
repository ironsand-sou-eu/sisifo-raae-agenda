import HeaderButton from "../micro/HeaderButton";
import FixedSelect from "../micro/FixedSelect";
import { useFilterAnimations } from "../hooks/FilterAnimationsProvider";
import { useFilters } from "../hooks/FiltersProvider";
import { useEffect } from "react";

export default function TopFilterHeader(): JSX.Element {
  // TODO: SELECT SINGLE Categoria de registro (tarefa, andamento, timesheet)
  const { toggleFilterVisibility } = useFilterAnimations();
  const { filters, applySelectedFilter, promptAddingFilter, promptDeletingFilter } = useFilters();
  const currentFilter = filters?.currentFilter ? [filters.currentFilter] : undefined;

  return (
    <header className="filter-header">
      <div />
      <div className="header-filter-container">
        <FixedSelect
          name="saved-filter-select"
          placeholder="Filtros salvos..."
          options={filters?.savedFilters}
          values={currentFilter}
          changeHandler={applySelectedFilter}
          isMulti={false}
        />
        <HeaderButton type="save" onClick={promptAddingFilter} />
        <HeaderButton type="delete" onClick={promptDeletingFilter} />
      </div>
      <HeaderButton type="filter" title="Exibir filtros..." onClick={toggleFilterVisibility} />
    </header>
  );
}
