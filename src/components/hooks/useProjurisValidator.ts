import { ZodType } from "zod";
import { DisplayingAndamento, PartialOrNullable } from "../../global";
import {
  errorMap,
  displayingAndamento,
  DisplayingTimesheet,
  displayingTimesheet,
  DisplayingNewTarefa,
  displayingNewTarefa,
} from "../../global.zod";

export type Validation = { ok: boolean; errors: Record<string, string> };

export default function useProjurisValidator() {
  function validateAndamento(andamento: PartialOrNullable<DisplayingAndamento>) {
    return validateEntity<DisplayingAndamento>(andamento, displayingAndamento);
  }

  function validateNewTarefa(newTarefa: PartialOrNullable<DisplayingNewTarefa>) {
    return validateEntity<DisplayingNewTarefa>(newTarefa, displayingNewTarefa);
  }

  function validateTimesheet(timesheet: PartialOrNullable<DisplayingTimesheet>) {
    return validateEntity<DisplayingTimesheet>(timesheet, displayingTimesheet);
  }

  function validateEntity<T>(entity: PartialOrNullable<T>, zodParser: ZodType<T>): Validation {
    const parsed = zodParser.safeParse(entity, { errorMap });
    const errors: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        const key = issue.path.join(".");
        errors[key] = issue.message;
      });
    }
    return { ok: parsed.success, errors };
  }

  return { validateNewTarefa, validateAndamento, validateTimesheet };
}
