import TopFilterHeader from "./TopFilterHeader";
import TopFilterBody from "./TopFilterBody";
import { useFilterAnimations } from "../hooks/FilterAnimationsProvider";
import FiltersProvider from "../hooks/FiltersProvider";

export default function TopFilter(): JSX.Element {
  const { showFilter } = useFilterAnimations();
  return (
    <aside className="filter">
      <FiltersProvider>
        <TopFilterHeader />
        {showFilter && <TopFilterBody />}
      </FiltersProvider>
    </aside>
  );
}
