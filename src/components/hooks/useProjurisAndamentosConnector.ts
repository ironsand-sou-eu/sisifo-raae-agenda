import { WritingAndamento } from "../../global";
import { useNotifications } from "./NotificationsProvider";
import { useMessageGenerator } from "./useMessageGenerator";
import useProjurisConnector from "./useProjurisConnector";

export type AndamentoUpdateActions = "criar";

export default function useProjurisTarefasConnector() {
  const { addNotification, removeNotification } = useNotifications();
  const { generateNotification } = useMessageGenerator();
  const { endpoints, makeProjurisRequest } = useProjurisConnector();

  async function dispatchBackendAndamentoCreation(andamentos: WritingAndamento | WritingAndamento[]): Promise<void> {
    const entries = Array.isArray(andamentos) ? andamentos : [andamentos];
    entries.forEach(async andamento => {
      setTimeout(() => {
        singleBackendAndamentoCreation(andamento);
      }, 200);
    });
  }

  async function singleBackendAndamentoCreation(andamento: WritingAndamento): Promise<void> {
    const progressMsg = generateNotification.progress("criar", "andamento");
    addNotification(progressMsg);
    const mainResponse = await makeProjurisRequest({
      method: "POST",
      endpoint: endpoints.criarAndamento,
      body: JSON.stringify(andamento),
    });
    removeNotification(progressMsg);
    const msg = generateNotification.response({ action: "criar", entityType: "andamento", mainResponse });
    addNotification(msg);
  }

  return {
    dispatchBackendAndamentoCreation,
  };
}
