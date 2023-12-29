import TarefasSmallCard from "./TarefaSmallCard";
import { useState } from "react";
import TarefaDetailedCard, { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import HeaderFilter from "./HeaderFilter";
import "../../styles.css";
import "react-datepicker/dist/react-datepicker.min.css";
import useTarefas from "../hooks/useTarefas";
import AppSkeleton from "./skeletons/AppSkeleton";
import useFetchedTarefasAdapter from "../hooks/useTarefasAdapter";
import { useLoading } from "../hooks/LoadingProvider";

export default function App() {
  const [prefetchDetails, setPrefetchDetails] = useState<TarefaPrefetchDetails | undefined>();
  const { tarefas } = useTarefas();
  const { loadingList } = useLoading();
  const { adaptFetchedTarefasList } = useFetchedTarefasAdapter();
  const displayingTarefas = adaptFetchedTarefasList(tarefas);
  return (
    <>
      <HeaderFilter />
      <main>
        {loadingList ? (
          <AppSkeleton />
        ) : (
          displayingTarefas?.map(tarefaInfo => (
            <TarefasSmallCard key={tarefaInfo.codigoTarefaEvento} tarefaDisplayInfo={tarefaInfo} setPrefetchDetails={setPrefetchDetails} />
          ))
        )}
        {prefetchDetails && <TarefaDetailedCard {...prefetchDetails} setPrefetchDetails={setPrefetchDetails} />}
      </main>
    </>
  );
}
