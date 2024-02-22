import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Prettify, DisplayingAndamento, DisplayingTimesheet, PartialOrNullable } from "../../../global";
import useProjurisValidator, { Validation } from "../useProjurisValidator";
import useCreateEntitiesAdapter from "../adapters/useCreateEntitiesAdapter";
import useProjurisCreateEntitiesConnector from "../connectors/useProjurisCreateEntitiesConnector";
import { DisplayingNewTarefa } from "../../../global.zod";

type VisibilityOptions = { visible: false } | { visible: true; codigoProcesso: number };

type CreateEntitiesContext = {
  andamento?: DisplayingAndamento;
  newTarefa?: DisplayingNewTarefa;
  timesheet?: DisplayingTimesheet;
  andamentoValidation?: Validation;
  newTarefaValidation?: Validation;
  timesheetValidation?: Validation;
  clearAndamento: () => void;
  clearNewTarefa: () => void;
  clearTimesheet: () => void;
  updateAndamento: (keysToUpdate: PartialOrNullable<DisplayingAndamento>) => void;
  updateNewTarefa: (keysToUpdate: PartialOrNullable<DisplayingNewTarefa>) => void;
  updateTimesheet: (keysToUpdate: PartialOrNullable<DisplayingTimesheet>) => void;
  createAndamentoTimesheet: () => void;
  createNewTarefa: () => void;
  showAndamentoTimesheetPanel: boolean;
  setAndamentoTimesheetPanelVisibility: (options: VisibilityOptions) => void;
  showNewTarefaPanel: boolean;
  setNewTarefaPanelVisibility: (options: VisibilityOptions) => void;
};

const CreateEntitiesContext = createContext<Prettify<CreateEntitiesContext>>({
  showAndamentoTimesheetPanel: false,
  showNewTarefaPanel: false,
  clearAndamento: () => {},
  clearNewTarefa: () => {},
  clearTimesheet: () => {},
  updateAndamento: () => {},
  updateNewTarefa: () => {},
  updateTimesheet: () => {},
  createAndamentoTimesheet: () => {},
  createNewTarefa: () => {},
  setAndamentoTimesheetPanelVisibility: () => {},
  setNewTarefaPanelVisibility: () => {},
});

export function useCreateEntities() {
  return useContext(CreateEntitiesContext);
}

export default function CreateEntitiesProvider({ children }: PropsWithChildren) {
  const { validateAndamento, validateNewTarefa, validateTimesheet } = useProjurisValidator();
  const {
    adaptDisplayingAndamentoToWritingType,
    adaptDisplayingNewTarefaToWritingType,
    adaptDisplayingTimesheetToWritingType,
  } = useCreateEntitiesAdapter();
  const { dispatchBackendEntityCreation } = useProjurisCreateEntitiesConnector();
  const [codigoProcesso, setCodigoProcesso] = useState(0);
  const [andamento, setAndamento] = useState<DisplayingAndamento>();
  const [andamentoValidation, setAndamentoValidation] = useState<Validation>();
  const [newTarefa, setNewTarefa] = useState<DisplayingNewTarefa>();
  const [newTarefaValidation, setNewTarefaValidation] = useState<Validation>();
  const [timesheet, setTimesheet] = useState<DisplayingTimesheet>();
  const [timesheetValidation, setTimesheetValidation] = useState<Validation>();
  const [showAndamentoTimesheetPanel, setshowAndamentoTimesheetPanel] = useState(false);
  const [showNewTarefaPanel, setShowNewTarefaPanel] = useState(false);

  useEffect(() => {
    const andamentoValidation = andamento ? validateAndamento(andamento) : undefined;
    setAndamentoValidation(andamentoValidation);
  }, [andamento]);

  useEffect(() => {
    const timesheetValidation = timesheet ? validateTimesheet(timesheet) : undefined;
    setTimesheetValidation(timesheetValidation);
  }, [timesheet]);

  useEffect(() => {
    const newTarefaValidation = newTarefa ? validateNewTarefa(newTarefa) : undefined;
    setNewTarefaValidation(newTarefaValidation);
  }, [newTarefa]);

  function updateAndamento(keysToUpdate: PartialOrNullable<DisplayingAndamento>): void {
    setAndamento(prevValues => ({ ...prevValues, ...keysToUpdate } as DisplayingAndamento));
  }

  function clearAndamento(): void {
    setAndamento(undefined);
  }

  function updateNewTarefa(keysToUpdate: PartialOrNullable<DisplayingNewTarefa>): void {
    setNewTarefa(prevValues => ({ ...prevValues, ...keysToUpdate } as DisplayingNewTarefa));
  }

  function clearNewTarefa(): void {
    setNewTarefa(undefined);
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
    createAndamento();
    createTimesheet();
  }

  function createAndamento() {
    if (!andamento || !codigoProcesso) return; //TODO: If there is no codigoProcesso, send notification
    const writingAndamento = adaptDisplayingAndamentoToWritingType(andamento, codigoProcesso);
    dispatchBackendEntityCreation(writingAndamento, { entityType: "andamento", onSuccessCb: clearAndamento });
  }

  function createTimesheet() {
    if (!timesheet) return;
    const writingTimesheet = adaptDisplayingTimesheetToWritingType(timesheet);
    dispatchBackendEntityCreation(writingTimesheet, {
      entityType: "timesheet",
      codigoProcesso,
      onSuccessCb: clearTimesheet,
    });
  }

  function createNewTarefa() {
    if (!newTarefa || !codigoProcesso) return; //TODO: If there is no codigoProcesso, send notification
    const writingNewTarefa = adaptDisplayingNewTarefaToWritingType(newTarefa, codigoProcesso);
    dispatchBackendEntityCreation(writingNewTarefa, { entityType: "newTarefa", onSuccessCb: clearNewTarefa });
  }

  function setAndamentoTimesheetPanelVisibility(options: VisibilityOptions) {
    if (options.visible === true) setCodigoProcesso(options.codigoProcesso);
    setshowAndamentoTimesheetPanel(options.visible);
  }

  function setNewTarefaPanelVisibility(options: VisibilityOptions) {
    if (options.visible === true) setCodigoProcesso(options.codigoProcesso);
    setShowNewTarefaPanel(options.visible);
  }

  const contextContent = {
    andamento,
    newTarefa,
    timesheet,
    andamentoValidation,
    newTarefaValidation,
    timesheetValidation,
    clearAndamento,
    clearNewTarefa,
    clearTimesheet,
    updateAndamento,
    updateNewTarefa,
    updateTimesheet,
    createAndamentoTimesheet,
    createNewTarefa,
    showAndamentoTimesheetPanel,
    setAndamentoTimesheetPanelVisibility,
    showNewTarefaPanel,
    setNewTarefaPanelVisibility,
  };

  return <CreateEntitiesContext.Provider value={contextContent}>{children}</CreateEntitiesContext.Provider>;
}
