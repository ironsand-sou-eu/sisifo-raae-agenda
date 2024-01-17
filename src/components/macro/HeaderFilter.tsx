import HeaderFilterHeader from "./HeaderFilterHeader";
import HeaderFilterBody from "./HeaderFilterBody";
import { useAnimations } from "../hooks/AnimationsProvider";

export default function HeaderFilter(): JSX.Element {
  const { show } = useAnimations();
  return (
    <aside className="filter">
      <HeaderFilterHeader />
      {show?.filter && <HeaderFilterBody />}
    </aside>
  );
}
