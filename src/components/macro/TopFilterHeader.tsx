import { Dispatch, RefObject, SetStateAction } from "react";
import HeaderButton from "../micro/HeaderButton";
import FixedSelect from "../micro/FixedSelect";

type TopFilterHeaderProps = {
  showFilter: boolean;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
  bodyDivRef: RefObject<HTMLDivElement>;
};

export default function TopFilterHeader({ showFilter, setShowFilter, bodyDivRef }: TopFilterHeaderProps): JSX.Element {
  function toggleFilterVisibility(): void {
    if (!showFilter) {
      setShowFilter(current => !current);
      return;
    }
    bodyDivRef.current?.style.setProperty("animation", "pickup-filter 500ms normal ease-in-out");
    setTimeout(() => {
      setShowFilter(current => !current);
    }, 450);
  }

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
