import { WritingAndamento, WritingTimesheet, WritingNewTarefa } from "../../../global";
import { useNotifications } from "../providers/NotificationsProvider";
import { useMessageGenerator } from "../useMessageGenerator";
import useProjurisConnector from "./useProjurisConnector";

export type CreatableEntities = "newTarefa" | "tarefa" | "andamento" | "timesheet";

export default function useProjurisCreateEntitiesConnector() {
  const { addNotification, removeNotification } = useNotifications();
  const { generateNotification } = useMessageGenerator();
  const { endpoints, makeProjurisRequest } = useProjurisConnector();

  async function dispatchBackendEntityCreation(
    entities:
      | WritingAndamento
      | WritingAndamento[]
      | WritingNewTarefa
      | WritingNewTarefa[]
      | WritingTimesheet
      | WritingTimesheet[],
    params: Omit<BackendCreationParams, "entity">
  ): Promise<void> {
    const entries = Array.isArray(entities) ? entities : [entities];
    entries.forEach(async entity => {
      setTimeout(() => {
        singleBackendEntityCreation({ ...params, entity });
      }, 200);
    });
  }

  type BackendCreationParams = {
    entity: WritingAndamento | WritingNewTarefa | WritingTimesheet;
    entityType: Exclude<CreatableEntities, "tarefa">;
    onSuccessCb?: CallableFunction;
    codigoProcesso?: number;
  };

  async function singleBackendEntityCreation(params: BackendCreationParams): Promise<void> {
    const { entity, entityType, onSuccessCb } = params;
    const codigoProcesso = "codigoProcesso" in params ? params.codigoProcesso : undefined;

    const creationEnpointsByEntityType = {
      newTarefa: endpoints.updateTarefa("criar"),
      andamento: endpoints.criarAndamento,
      timesheet: codigoProcesso ? endpoints.criarTimesheet(codigoProcesso) : "",
    };
    const progressMsg = generateNotification.progress("criar", entityType);
    addNotification(progressMsg);
    const mainResponse = await makeProjurisRequest({
      method: "POST",
      endpoint: creationEnpointsByEntityType[entityType],
      body: JSON.stringify(entity),
    });
    removeNotification(progressMsg);
    const msg = await generateNotification.response({
      action: "criar",
      entityType,
      mainResponse,
    });
    addNotification(msg);
    if (onSuccessCb && mainResponse.ok) onSuccessCb();
  }

  return {
    dispatchBackendEntityCreation,
  };
}
