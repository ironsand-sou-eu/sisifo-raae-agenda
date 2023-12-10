import { useRef, useState } from "react";
import TopFilterHeader from "./TopFilterHeader";
import TopFilterBody from "./TopFilterBody";

type TopFilterProps = {};

export default function TopFilter(): JSX.Element {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const bodyDivRef = useRef<HTMLDivElement>(null);

  return (
    <aside className="filter">
      <TopFilterHeader showFilter={showFilter} setShowFilter={setShowFilter} bodyDivRef={bodyDivRef} />
      {showFilter && <TopFilterBody bodyDivRef={bodyDivRef} />}
    </aside>
  );
}
