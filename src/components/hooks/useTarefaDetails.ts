import { useEffect, useState } from "react";
import useProjurisConnector from "./useProjurisConnector";
import { DisplayingTarefaDetails, ReceivedTarefaDetails } from "../../global";
import useFetchedTarefasAdapter from "./useTarefasAdapter";

export default function useTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number, tarefaColor: string) {
  const [tarefaDetails, setTarefaDetails] = useState<ReceivedTarefaDetails>();
  const [displayingTarefaDetails, setDisplayingTarefaDetails] = useState<DisplayingTarefaDetails>();
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { fetchTarefaDetails } = useProjurisConnector();
  const { adaptFetchedTarefaDetailsToDisplayingType, adaptTarefaDetailsToWritingType } = useFetchedTarefasAdapter();

  useEffect(() => {
    setIsDetailLoading(true);
    fetchTarefaDetails(codigoTarefaEvento, codigoProcesso)
      .then(details => {
        setTarefaDetails(details);
      })
      .catch(e => console.error(e))
      .finally(() => setIsDetailLoading(false));
  }, [codigoTarefaEvento, codigoProcesso]);

  useEffect(() => {
    setDisplayingTarefaDetails(() => {
      const dispdetails = adaptFetchedTarefaDetailsToDisplayingType(tarefaDetails, tarefaColor);
      return dispdetails;
    });
  }, [tarefaDetails]);

  function updateTarefaDetails(key: keyof ReceivedTarefaDetails["tarefaEventoWs"], newValue: unknown): void {
    setTarefaDetails(prevValues => {
      if (!prevValues) return;
      const tarefaEventoWs = { ...prevValues.tarefaEventoWs, [key]: newValue };
      return { ...prevValues, tarefaEventoWs };
    });
  }

  function saveTarefa() {
    if (!tarefaDetails) return;
    const writeAdaptedTarefaDetails = adaptTarefaDetailsToWritingType(tarefaDetails);
    console.log(writeAdaptedTarefaDetails);
  }

  return { displayingTarefaDetails, isDetailLoading, updateTarefaDetails, saveTarefa };
}
