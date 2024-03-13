import HeaderButton from "../../micro/HeaderButton";
import FixedSelect from "../../micro/FixedSelect";
import { AnimationsContext, useAnimations } from "../../hooks/providers/AnimationsProvider";
import { useFilters } from "../../hooks/providers/FiltersProvider";

type HeaderFilterHeaderProps = {
  animatableElementId: string;
};

export default function HeaderFilterHeader({ animatableElementId }: HeaderFilterHeaderProps): JSX.Element {
  // TODO: SELECT SINGLE Categoria de registro (tarefa, andamento, timesheet)
  const { toggleVisibility, isVisible } = useAnimations() as AnimationsContext;
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
      <HeaderButton
        type="filter"
        title={(isVisible(animatableElementId) ? "Ocultar filtros" : "Exibir filtros") + "... (Ctrl + q)"}
        onClick={() => toggleVisibility(animatableElementId)}
      />
    </header>
  );
}
