import { useEffect, useState } from "react";
import useProjurisConnector from "./useProjurisConnector";
import { ReceivedTarefaDetails } from "../../global";

export default function useTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number) {
  const [tarefaDetails, setTarefaDetails] = useState<ReceivedTarefaDetails>();
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { fetchTarefaDetails } = useProjurisConnector();

  useEffect(() => {
    setIsDetailLoading(true);
    fetchTarefaDetails(codigoTarefaEvento, codigoProcesso)
      .then(details => {
        setTarefaDetails(details);
        setIsDetailLoading(false);
      })
      .catch(e => console.error(e));
  }, []);

  return { tarefaDetails, isDetailLoading };
}
