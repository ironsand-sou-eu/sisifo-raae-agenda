import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Prettify, DisplayingAndamento, DisplayingTimesheet, PartialOrNullable } from "../../global";
import useProjurisValidator, { Validation } from "./useProjurisValidator";

type VisibilityOptions = { visible: false } | { visible: true; codigoProcesso: number };

type AndamentosTimesheetsContext = {
  andamento?: DisplayingAndamento;
  timesheet?: DisplayingTimesheet;
  andamentoValidation?: Validation;
  timesheetValidation?: Validation;
  clearAndamento: () => void;
  clearTimesheet: () => void;
  updateAndamento: (keysToUpdate: PartialOrNullable<DisplayingAndamento>) => void;
  updateTimesheet: (keysToUpdate: PartialOrNullable<DisplayingTimesheet>) => void;
  createAndamentoTimesheet: () => void;
  showAndamentosTarefasPanel: boolean;
  setAndamentosTarefasPanelVisibility: (options: VisibilityOptions) => void;
};

const AndamentosTimesheetsContext = createContext<Prettify<AndamentosTimesheetsContext>>({
  showAndamentosTarefasPanel: false,
  clearAndamento: () => {},
  clearTimesheet: () => {},
  updateAndamento: () => {},
  updateTimesheet: () => {},
  createAndamentoTimesheet: () => {},
  setAndamentosTarefasPanelVisibility: () => {},
});

export function useAndamentosTimesheets() {
  return useContext(AndamentosTimesheetsContext);
}

export default function AndamentosTimesheetsProvider({ children }: PropsWithChildren) {
  const { validateAndamento, validateTimesheet } = useProjurisValidator();
  const [codigoProcesso, setCodigoProcesso] = useState(0);
  const [andamento, setAndamento] = useState<DisplayingAndamento>();
  const [andamentoValidation, setAndamentoValidation] = useState<Validation>();
  const [timesheet, setTimesheet] = useState<DisplayingTimesheet>();
  const [timesheetValidation, setTimesheetValidation] = useState<Validation>();
  const [showAndamentosTarefasPanel, setShowAndamentosTarefasPanel] = useState(false);

  useEffect(() => {
    const andamentoValidation = andamento ? validateAndamento(andamento) : undefined;
    setAndamentoValidation(andamentoValidation);
  }, [andamento]);

  useEffect(() => {
    const timesheetValidation = timesheet ? validateTimesheet(timesheet) : undefined;
    setTimesheetValidation(timesheetValidation);
  }, [timesheet]);

  function updateAndamento(keysToUpdate: PartialOrNullable<DisplayingAndamento>): void {
    setAndamento(prevValues => ({ ...prevValues, ...keysToUpdate } as DisplayingAndamento));
  }

  function clearAndamento(): void {
    setAndamento(undefined);
  }

  function updateTimesheet(keysToUpdate: PartialOrNullable<DisplayingTimesheet>): void {
    setTimesheet(prevValues => {
      if (!prevValues?.faturar) return { ...prevValues, faturar: false, ...keysToUpdate } as DisplayingTimesheet;
      return { ...prevValues, ...keysToUpdate } as DisplayingTimesheet;
    });
  }

  function clearTimesheet(): void {
    setTimesheet(undefined);
  }

  function createAndamentoTimesheet(): void {
    console.log({ codigoProcesso, andamento, timesheet });
  }

  function setAndamentosTarefasPanelVisibility(options: VisibilityOptions) {
    if (options.visible === true) setCodigoProcesso(options.codigoProcesso);
    setShowAndamentosTarefasPanel(options.visible);
  }

  const contextContent = {
    andamento,
    timesheet,
    andamentoValidation,
    timesheetValidation,
    clearAndamento,
    clearTimesheet,
    updateAndamento,
    updateTimesheet,
    createAndamentoTimesheet,
    showAndamentosTarefasPanel,
    setAndamentosTarefasPanelVisibility,
  };

  return <AndamentosTimesheetsContext.Provider value={contextContent}>{children}</AndamentosTimesheetsContext.Provider>;
}
