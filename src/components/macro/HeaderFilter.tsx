import HeaderFilterHeader from "./HeaderFilterHeader";
import HeaderFilterBody from "./HeaderFilterBody";
import { useFilterAnimations } from "../hooks/FilterAnimationsProvider";

export default function HeaderFilter(): JSX.Element {
  const { showFilter } = useFilterAnimations();
  return (
    <aside className="filter">
      <HeaderFilterHeader />
      {showFilter && <HeaderFilterBody />}
    </aside>
  );
}
