import TarefasSmallCard from "./TarefaSmallCard";
import { useState } from "react";
import TarefaDetailedCard, { TarefaRenderingDetails } from "./TarefaDetailedCard";
import HeaderFilter from "./HeaderFilter";
import "../../styles.css";
import "react-datepicker/dist/react-datepicker.min.css";
import { Tarefa } from "../../global";
import useTarefas from "../hooks/useTarefas";
import AppSkeleton from "./skeletons/AppSkeleton";

export default function App() {
  const [renderDetails, setRenderDetails] = useState<TarefaRenderingDetails | undefined>();
  const { tarefas, isLoading } = useTarefas();

  return (
    <>
      <HeaderFilter />
      <main>
        {isLoading && <AppSkeleton />}
        {!isLoading &&
          tarefas?.map((tarefaInfo: Tarefa) => (
            <TarefasSmallCard key={tarefaInfo.codigoTarefaEvento} tarefaInfo={tarefaInfo} setRenderDetails={setRenderDetails} />
          ))}
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
