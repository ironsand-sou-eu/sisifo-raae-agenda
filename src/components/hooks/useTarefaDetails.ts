import { useEffect, useState } from "react";
import useProjurisConnector, { TarefaDetails } from "./useProjurisConnector";
import { useLoading } from "./LoadingProvider";

export default function useTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number) {
  const [tarefaDetails, setTarefaDetails] = useState<TarefaDetails>();
  const { setIsLoading } = useLoading();
  const { fetchTarefaDetails } = useProjurisConnector();

  useEffect(() => {
    setIsLoading(prevValues => {
      return { ...prevValues, loadingDetails: true };
    });
    fetchTarefaDetails(codigoTarefaEvento, codigoProcesso)
      .then(details => {
        console.log({ details });
        setTarefaDetails(details);
        setIsLoading(prevValues => {
          return { ...prevValues, loadingDetails: false };
        });
      })
      .catch(e => console.error(e));
  }, []);

  return { tarefaDetails };
}
