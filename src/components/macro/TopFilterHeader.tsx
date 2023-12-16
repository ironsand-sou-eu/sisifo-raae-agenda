import HeaderButton from "../micro/HeaderButton";
import FixedSelect from "../micro/FixedSelect";
import { useFilterAnimations } from "../hooks/FilterAnimationsProvider";

export default function TopFilterHeader(): JSX.Element {
  const { toggleFilterVisibility } = useFilterAnimations();
  // SELECT SINGLE Categoria de registro (tarefa, andamento, timesheet)
  return (
    <header className="filter-header">
      <div />
      <FixedSelect
        name="saved-filter-select"
        placeholder="Filtros salvos..."
        options={undefined}
        values={undefined}
        isMulti={false}
      />
      <HeaderButton type="filter" title="Exibir filtros..." onClick={toggleFilterVisibility} />
    </header>
  );
}
