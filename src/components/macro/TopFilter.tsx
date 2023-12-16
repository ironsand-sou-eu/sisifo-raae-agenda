import TopFilterHeader from "./TopFilterHeader";
import TopFilterBody from "./TopFilterBody";
import { useFilterAnimations } from "../hooks/FilterAnimationsProvider";

export default function TopFilter(): JSX.Element {
  const { showFilter } = useFilterAnimations();

  return (
    <aside className="filter">
      <TopFilterHeader />
      {showFilter && <TopFilterBody />}
    </aside>
  );
}
