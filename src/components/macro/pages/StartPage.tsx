import { useEffect, useRef, useState } from "react";
import { useTarefasList } from "../../hooks/providers/TarefasListProvider";
import HeaderFilter from "../blocks/HeaderFilter";
import FloatingCommandBar from "../blocks/FloatingCommandBar";
import TarefasSmallCard from "../blocks/TarefaSmallCard";
import TarefaDetailedCard, { TarefaPrefetchDetails } from "../blocks/TarefaDetailedCard";
import StartPageSkeleton from "../skeletons/StartPageSkeleton";
import "react-datepicker/dist/react-datepicker.min.css";
import Messenger from "../blocks/Messenger";
import { useAnimations } from "../../hooks/providers/AnimationsProvider";
import EndCard from "../blocks/EndCard";
import { useCreateEntities } from "../../hooks/providers/CreateEntitiesProvider";
import AndamentosTimesheetCard from "../blocks/AndamentosTimesheetCard";
import NewTarefaCard from "../blocks/NewTarefaCard";

export default function StartPage() {
  const [prefetchDetails, setPrefetchDetails] = useState<TarefaPrefetchDetails | undefined>();
  const { displayingTarefas, selectedTarefas, hasMore, pageNumber, setPageNumber, isListLoading } = useTarefasList();
  const { showAndamentoTimesheetPanel, showNewTarefaPanel } = useCreateEntities();
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
        {displayingTarefas?.map(tarefaDisplayInfo => (
          <TarefasSmallCard key={tarefaDisplayInfo.codigoTarefaEvento} {...{ tarefaDisplayInfo, setPrefetchDetails }} />
        ))}
        {isListLoading ? <StartPageSkeleton /> : <EndCard hasMore={hasMore} ref={pageEndRef} />}
        {prefetchDetails && <TarefaDetailedCard {...prefetchDetails} {...{ setPrefetchDetails }} />}
        {showAndamentoTimesheetPanel && <AndamentosTimesheetCard />}
        {showNewTarefaPanel && <NewTarefaCard />}
        <Messenger />
      </main>
    </>
  );
}
