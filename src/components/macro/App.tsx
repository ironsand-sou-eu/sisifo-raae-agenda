import TarefasSmallCard from "./TarefaSmallCard";
import { useState } from "react";
import TarefaDetailedCard, { TarefaRenderingDetails } from "./TarefaDetailedCard";
import HeaderFilter from "./HeaderFilter";
import "../../styles.css";
import "react-datepicker/dist/react-datepicker.min.css";
import useTarefas from "../hooks/useTarefas";
import AppSkeleton from "./skeletons/AppSkeleton";
import useFetchedTarefasAdapter from "../hooks/useTarefasAdapter";

export default function App() {
  const [renderDetails, setRenderDetails] = useState<TarefaRenderingDetails | undefined>();
  const { tarefas, isLoading } = useTarefas();
  const { adaptFetchedTarefasList } = useFetchedTarefasAdapter();
  const displayingTarefas = adaptFetchedTarefasList(tarefas);
  return (
    <>
      <HeaderFilter />
      <main>
        {isLoading ? (
          <AppSkeleton />
        ) : (
          displayingTarefas?.map(tarefaInfo => (
            <TarefasSmallCard key={tarefaInfo.codigoTarefaEvento} tarefaDisplayInfo={tarefaInfo} setRenderDetails={setRenderDetails} />
          ))
        )}
        {renderDetails && (
          <TarefaDetailedCard
            codigoTarefaEvento={renderDetails.codigoTarefaEvento}
            codigoProcesso={renderDetails.codigoProcesso}
            parteAtiva={renderDetails.parteAtiva}
            partePassiva={renderDetails.partePassiva}
            numeroProcesso={renderDetails.numeroProcesso}
            setRenderDetails={setRenderDetails}
            tarefaColor={renderDetails.tarefaColor}
          />
        )}
      </main>
    </>
  );
}
