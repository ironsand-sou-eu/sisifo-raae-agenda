import { WritingAndamento } from "../../../global";
import { useNotifications } from "../providers/NotificationsProvider";
import { useMessageGenerator } from "../useMessageGenerator";
import useProjurisConnector from "./useProjurisConnector";

export type AndamentoUpdateActions = "criar";

export default function useProjurisAndamentosConnector() {
  const { addNotification, removeNotification } = useNotifications();
  const { generateNotification } = useMessageGenerator();
  const { endpoints, makeProjurisRequest } = useProjurisConnector();

  async function dispatchBackendAndamentoCreation(
    andamentos: WritingAndamento | WritingAndamento[],
    onSuccessCb?: CallableFunction
  ): Promise<void> {
    const entries = Array.isArray(andamentos) ? andamentos : [andamentos];
    entries.forEach(async andamento => {
      setTimeout(() => {
        singleBackendAndamentoCreation(andamento, onSuccessCb);
      }, 200);
    });
  }

  async function singleBackendAndamentoCreation(
    andamento: WritingAndamento,
    onSuccessCb?: CallableFunction
  ): Promise<void> {
    const progressMsg = generateNotification.progress("criar", "andamento");
    addNotification(progressMsg);
    const mainResponse = await makeProjurisRequest({
      method: "POST",
      endpoint: endpoints.criarAndamento,
      body: JSON.stringify(andamento),
    });
    removeNotification(progressMsg);
    const msg = generateNotification.response({
      action: "criar",
      entityGender: "masculine",
      entityType: "andamento",
      mainResponse,
    });

    addNotification(msg);
    if (onSuccessCb && mainResponse.ok) onSuccessCb();
  }

  return {
    dispatchBackendAndamentoCreation,
  };
}
