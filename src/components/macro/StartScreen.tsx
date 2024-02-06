import { useEffect, useRef, useState } from "react";
import { useTarefasList } from "../hooks/TarefasListProvider";
import HeaderFilter from "./HeaderFilter";
import FloatingCommandBar from "./FloatingCommandBar";
import TarefasSmallCard from "./TarefaSmallCard";
import TarefaDetailedCard, { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import StartScreenSkeleton from "./skeletons/StartScreenSkeleton";
import "react-datepicker/dist/react-datepicker.min.css";
import Messenger from "./Messenger";
import { useAnimations } from "../hooks/AnimationsProvider";
import EndCard from "./EndCard";

export default function StartScreen() {
  const [prefetchDetails, setPrefetchDetails] = useState<TarefaPrefetchDetails | undefined>();
  const { displayingTarefas, selectedTarefas, hasMore, pageNumber, setPageNumber, isListLoading } = useTarefasList();
  const { toggleVisibility } = useAnimations();
  const pageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeydown({ key, ctrlKey }: KeyboardEvent) {
      if (ctrlKey && key === "q") toggleVisibility("filter");
    }
    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (isListLoading) return;
      if (entries[0].isIntersecting && hasMore) setPageNumber(prev => prev + 1);
    });

    if (pageEndRef.current) observer.observe(pageEndRef.current);

    return () => observer.disconnect();
  }, [pageEndRef.current, hasMore, pageNumber]);

  return (
    <>
      <HeaderFilter />
      <main>
        {!!selectedTarefas.length && <FloatingCommandBar />}
        {isListLoading ? (
          <StartScreenSkeleton />
        ) : (
          displayingTarefas?.map(tarefaDisplayInfo => (
            <TarefasSmallCard
              key={tarefaDisplayInfo.codigoTarefaEvento}
              {...{ tarefaDisplayInfo, setPrefetchDetails }}
            />
          ))
        )}
        {!isListLoading && <EndCard hasMore={hasMore} ref={pageEndRef} key={"dummy-key-to-avoid-error-kjhi4g5"} />}
        {prefetchDetails && <TarefaDetailedCard {...prefetchDetails} {...{ setPrefetchDetails }} />}
        <Messenger />
      </main>
    </>
  );
}
