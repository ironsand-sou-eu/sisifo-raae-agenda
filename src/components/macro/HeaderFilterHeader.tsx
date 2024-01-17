import HeaderButton from "../micro/HeaderButton";
import FixedSelect from "../micro/FixedSelect";
import { useAnimations } from "../hooks/AnimationsProvider";
import { useFilters } from "../hooks/FiltersProvider";

export default function HeaderFilterHeader(): JSX.Element {
  // TODO: SELECT SINGLE Categoria de registro (tarefa, andamento, timesheet)
  const { toggleVisibility } = useAnimations();
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
          onChange={applySelectedFilter}
          isMulti={false}
        />
        <HeaderButton type="save" onClick={promptAddingFilter} />
        <HeaderButton type="delete" onClick={promptDeletingFilter} />
      </div>
      <HeaderButton type="filter" title="Exibir filtros..." onClick={() => toggleVisibility("filter")} />
    </header>
  );
}
