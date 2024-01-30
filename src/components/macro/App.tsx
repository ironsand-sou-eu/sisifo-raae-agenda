import { useEffect, useState } from "react";
import { useTarefasList } from "../hooks/TarefasListProvider";
import HeaderFilter from "./HeaderFilter";
import FloatingCommandBar from "./FloatingCommandBar";
import TarefasSmallCard from "./TarefaSmallCard";
import TarefaDetailedCard, { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import AppSkeleton from "./skeletons/AppSkeleton";
import "../../styles.css";
import "react-datepicker/dist/react-datepicker.min.css";
import Messenger from "./Messenger";
import { useAnimations } from "../hooks/AnimationsProvider";

export default function App() {
  const [prefetchDetails, setPrefetchDetails] = useState<TarefaPrefetchDetails | undefined>();
  const { displayingTarefas, selectedTarefas, isListLoading } = useTarefasList();
  const { toggleVisibility } = useAnimations();

  useEffect(() => {
    function handleKeydown({ key, ctrlKey }: KeyboardEvent) {
      if (ctrlKey && key === "q") toggleVisibility("filter");
    }
    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <>
      <HeaderFilter />
      <main>
        {!!selectedTarefas.length && <FloatingCommandBar />}
        {isListLoading ? (
          <AppSkeleton />
        ) : (
          displayingTarefas?.map(tarefaDisplayInfo => (
            <TarefasSmallCard
              key={tarefaDisplayInfo.codigoTarefaEvento}
              {...{ tarefaDisplayInfo, setPrefetchDetails }}
            />
          ))
        )}
        {prefetchDetails && <TarefaDetailedCard {...prefetchDetails} {...{ setPrefetchDetails }} />}
        <Messenger />
      </main>
    </>
  );
}
