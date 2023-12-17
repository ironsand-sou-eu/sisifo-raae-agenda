import HeaderButton from "../micro/HeaderButton";
import FixedSelect from "../micro/FixedSelect";
import { useFilterAnimations } from "../hooks/FilterAnimationsProvider";
import { useFilters } from "../hooks/FiltersProvider";

export default function TopFilterHeader(): JSX.Element {
  // TODO: SELECT SINGLE Categoria de registro (tarefa, andamento, timesheet)
  const { toggleFilterVisibility } = useFilterAnimations();
  const { filters, applyFilter } = useFilters();
  const currentFilter = filters?.currentFilter ? [filters.currentFilter] : undefined;

  return (
    <header className="filter-header">
      <div />
      <FixedSelect
        name="saved-filter-select"
        placeholder="Filtros salvos..."
        options={filters?.savedFilters}
        values={currentFilter}
        changeHandler={applyFilter}
        isMulti={false}
      />
      <HeaderButton type="filter" title="Exibir filtros..." onClick={toggleFilterVisibility} />
    </header>
  );
}
