import { WritingTimesheet } from "../../../global";
import { useNotifications } from "../providers/NotificationsProvider";
import { useMessageGenerator } from "../useMessageGenerator";
import useProjurisConnector from "./useProjurisConnector";

export type TimesheetUpdateActions = "criar";

export default function useProjurisTimesheetConnector() {
  const { addNotification, removeNotification } = useNotifications();
  const { generateNotification } = useMessageGenerator();
  const { endpoints, makeProjurisRequest } = useProjurisConnector();

  async function dispatchBackendTimesheetCreation(
    timesheets: WritingTimesheet | WritingTimesheet[],
    codigoProcesso: number,
    onSuccessCb?: CallableFunction
  ): Promise<void> {
    const entries = Array.isArray(timesheets) ? timesheets : [timesheets];
    entries.forEach(async timesheet => {
      setTimeout(() => {
        singleBackendTimesheetCreation(timesheet, codigoProcesso, onSuccessCb);
      }, 200);
    });
  }

  async function singleBackendTimesheetCreation(
    timesheet: WritingTimesheet,
    codigoProcesso: number,
    onSuccessCb?: CallableFunction
  ): Promise<void> {
    const progressMsg = generateNotification.progress("criar", "timesheet");
    addNotification(progressMsg);
    const mainResponse = await makeProjurisRequest({
      method: "POST",
      endpoint: endpoints.criarTimesheet(codigoProcesso),
      body: JSON.stringify(timesheet),
    });
    removeNotification(progressMsg);
    const msg = generateNotification.response({
      action: "criar",
      entityGender: "masculine",
      entityType: "timesheet",
      mainResponse,
    });
    addNotification(msg);
    if (onSuccessCb && mainResponse.ok) onSuccessCb();
  }

  return {
    dispatchBackendTimesheetCreation,
  };
}
