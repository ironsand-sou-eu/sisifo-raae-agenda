import "./styles.css";
import TarefasSmallCard from "./components/micro/TarefaSmallCard";
import { useState } from "react";
import TarefaDetailedCard, { TarefaRenderingDetails } from "./components/micro/TarefaDetailedCard";
import tarefasMock from "./mocks/app-mocks";

function App() {
  const [tarefas, setTarefas] = useState(tarefasMock);
  const [renderDetails, setRenderDetails] = useState<TarefaRenderingDetails | undefined>();

  return (
    <main>
      {tarefas.map(tarefaInfo => (
        <TarefasSmallCard key={tarefaInfo.identificador} tarefaInfo={tarefaInfo} setRenderDetails={setRenderDetails} />
      ))}
      {renderDetails && (
        <TarefaDetailedCard
          codigoTarefaEvento={renderDetails.codigoTarefaEvento}
          codigoProcesso={renderDetails.codigoProcesso}
          parteAtiva={renderDetails.parteAtiva}
          partePassiva={renderDetails.partePassiva}
          numeroProcesso={renderDetails.numeroProcesso}
          setRenderDetails={setRenderDetails}
        />
      )}
    </main>
  );
}

export default App;
