import { useEffect, useState } from "react";
import useProjurisConnector, { TarefaDetails } from "./useProjurisConnector";

export default function useTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number) {
  const [tarefaDetails, setTarefaDetails] = useState<TarefaDetails>();
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { fetchTarefaDetails } = useProjurisConnector();

  useEffect(() => {
    setIsDetailLoading(true);
    fetchTarefaDetails(codigoTarefaEvento, codigoProcesso)
      .then(details => {
        console.log({ details });
        setTarefaDetails(details);
        setIsDetailLoading(false);
      })
      .catch(e => console.error(e));
  }, []);

  return { tarefaDetails, isDetailLoading };
}
