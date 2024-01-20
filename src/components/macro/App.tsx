import { useState } from "react";
import useFetchedTarefasAdapter from "../hooks/useTarefasAdapter";
import { useTarefasList } from "../hooks/TarefasListProvider";
import HeaderFilter from "./HeaderFilter";
import FloatingCommandBar from "./FloatingCommandBar";
import TarefasSmallCard from "./TarefaSmallCard";
import TarefaDetailedCard, { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import AppSkeleton from "./skeletons/AppSkeleton";
import "../../styles.css";
import "react-datepicker/dist/react-datepicker.min.css";

export default function App() {
  const [prefetchDetails, setPrefetchDetails] = useState<TarefaPrefetchDetails | undefined>();
  const { tarefas, isListLoading } = useTarefasList();
  const { adaptFetchedTarefasListToDisplayingType } = useFetchedTarefasAdapter();
  const displayingTarefas = adaptFetchedTarefasListToDisplayingType(tarefas);
  const selectedTarefas = tarefas?.filter(tarefa => tarefa.checked);

  return (
    <>
      <HeaderFilter />
      <main>
        {!!selectedTarefas.length && <FloatingCommandBar />}
        {isListLoading ? (
          <AppSkeleton />
        ) : (
          displayingTarefas?.map(tarefaInfo => (
            <TarefasSmallCard key={tarefaInfo.codigoTarefaEvento} tarefaDisplayInfo={tarefaInfo} {...{ setPrefetchDetails }} />
          ))
        )}
        {prefetchDetails && <TarefaDetailedCard {...prefetchDetails} {...{ setPrefetchDetails }} />}
      </main>
    </>
  );
}
