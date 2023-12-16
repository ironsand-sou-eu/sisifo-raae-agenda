import TarefasSmallCard from "./TarefaSmallCard";
import { useEffect, useState } from "react";
import TarefaDetailedCard, { TarefaRenderingDetails } from "./TarefaDetailedCard";
import tarefasMock, { Tarefa } from "../../mocks/app-mocks";
import TopFilter from "./TopFilter";
import "../../styles.css";
import "react-datepicker/dist/react-datepicker.min.css";
import FilterAnimationsProvider from "../hooks/FilterAnimationsProvider";

function App() {
  const [tarefas, setTarefas] = useState<Tarefa[] | undefined>();
  const [renderDetails, setRenderDetails] = useState<TarefaRenderingDetails | undefined>();

  useEffect(() => {
    setTarefas(tarefasMock);
  }, []);

  return (
    <>
      <FilterAnimationsProvider>
        <TopFilter />
      </FilterAnimationsProvider>
      <main>
        {tarefas?.map(tarefaInfo => (
          <TarefasSmallCard
            key={tarefaInfo.identificador}
            tarefaInfo={tarefaInfo}
            setRenderDetails={setRenderDetails}
          />
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

export default App;
