import { ZodType } from "zod";
import { DisplayingAndamento } from "../../global";
import { errorMap, displayingAndamento, DisplayingTimesheet, displayingTimesheet } from "../../global.zod";

export type Validation = { ok: boolean; errors: Record<string, string> };

export default function useProjurisValidator() {
  function validateAndamento(andamento: Partial<DisplayingAndamento>) {
    return validateEntity<DisplayingAndamento>(andamento, displayingAndamento);
  }

  function validateTarefa() {}

  function validateTimesheet(timesheet: Partial<DisplayingTimesheet>) {
    return validateEntity<DisplayingTimesheet>(timesheet, displayingTimesheet);
  }

  function validateEntity<T>(entity: Partial<T>, zodParser: ZodType<T>): Validation {
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

  return { validateTarefa, validateAndamento, validateTimesheet };
}
