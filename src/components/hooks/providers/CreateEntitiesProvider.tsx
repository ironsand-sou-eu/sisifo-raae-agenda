import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { DisplayingAndamento, DisplayingTimesheet, PartialOrNullable } from "../../../global";
import useProjurisValidator, { Validation } from "../useProjurisValidator";
import useCreateEntitiesAdapter from "../adapters/useCreateEntitiesAdapter";
import useProjurisCreateEntitiesConnector from "../connectors/useProjurisCreateEntitiesConnector";
import { DisplayingNewTarefa, SimpleDocument } from "../../../global.zod";
import useProjurisConnector from "../connectors/useProjurisConnector";

type ParentDetails = { codigoProcesso: number; idTarefa?: string; tipoTarefa?: string };
type VisibilityOptions = { visible: false } | { visible: true; parentDetails: ParentDetails };

export type CreateEntitiesContext = {
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
  updateNewTarefa: (keysToUpdate: PartialOrNullable<DisplayingNewTarefa>) => Promise<void>;
  updateTimesheet: (keysToUpdate: PartialOrNullable<DisplayingTimesheet>) => void;
  pendingStatus?: SimpleDocument;
  createAndamentoTimesheet: () => void;
  createNewTarefa: () => void;
  showAndamentoTimesheetPanel: boolean;
  setAndamentoTimesheetPanelVisibility: (options: VisibilityOptions) => void;
  showNewTarefaPanel: boolean;
  setNewTarefaPanelVisibility: (options: VisibilityOptions) => void;
};

const CreateEntitiesContext = createContext<CreateEntitiesContext | undefined>(undefined);

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
  const { loadSimpleOptions, endpoints } = useProjurisConnector();
  const [parentDetails, setParentDetails] = useState<ParentDetails>();
  const [pendingStatus, setPendingStatus] = useState<SimpleDocument>();
  const [andamento, setAndamento] = useState<DisplayingAndamento>();
  const [andamentoValidation, setAndamentoValidation] = useState<Validation>();
  const [newTarefa, setNewTarefa] = useState<DisplayingNewTarefa>();
  const [newTarefaValidation, setNewTarefaValidation] = useState<Validation>();
  const [timesheet, setTimesheet] = useState<DisplayingTimesheet>();
  const [timesheetValidation, setTimesheetValidation] = useState<Validation>();
  const [showAndamentoTimesheetPanel, setshowAndamentoTimesheetPanel] = useState(false);
  const [showNewTarefaPanel, setShowNewTarefaPanel] = useState(false);

  useEffect(() => {
    loadSimpleOptions(
      endpoints.tarefa.consultarSituacoes,
      {
        key: "valor",
        operator: "insensitiveStrictEquality",
        val: "pendente",
      },
      false
    ).then(data => {
      if (data.length > 0) {
        setPendingStatus(data[0]);
        setNewTarefa(createEmptyNewTarefa(data[0]));
      }
    });
  }, []);

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

  async function updateNewTarefa(keysToUpdate: PartialOrNullable<DisplayingNewTarefa>): Promise<void> {
    const adaptedKeys = await handleKeysBeforeUpdate(keysToUpdate);
    setNewTarefa(prevValues => ({ ...prevValues, ...adaptedKeys } as DisplayingNewTarefa));
  }

  async function handleKeysBeforeUpdate(
    keysToUpdate: PartialOrNullable<DisplayingNewTarefa>
  ): Promise<PartialOrNullable<DisplayingNewTarefa>> {
    let result = structuredClone(keysToUpdate);
    if (Object.keys(keysToUpdate).includes("quadroKanban")) {
      if (!keysToUpdate.quadroKanban) result = { ...result, quadroKanban: null, colunaKanban: null };
      else if (!!newTarefa?.tarefaEventoSituacaoWs?.valor) result = await adaptBeforeUpdatingQuadroKanban(keysToUpdate);
    }
    return result;
  }

  async function adaptBeforeUpdatingQuadroKanban(keysToUpdate: PartialOrNullable<DisplayingNewTarefa>) {
    const matchingColunasKanban = await loadSimpleOptions(
      endpoints.kanban.consultarColunasDeUmQuadro(keysToUpdate.quadroKanban?.chave),
      {
        key: "valor",
        operator: "insensitiveStrictEquality",
        val: newTarefa?.tarefaEventoSituacaoWs.valor,
      },
      false
    );
    const colunaValue = matchingColunasKanban.length > 0 ? matchingColunasKanban[0] : null;
    return { ...keysToUpdate, colunaKanban: colunaValue };
  }

  function clearNewTarefa(): void {
    setNewTarefa(pendingStatus ? createEmptyNewTarefa(pendingStatus) : undefined);
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
    if (!andamento || !parentDetails?.codigoProcesso) return; //TODO: If there is no codigoProcesso, send notification
    const writingAndamento = adaptDisplayingAndamentoToWritingType(andamento, parentDetails.codigoProcesso);
    dispatchBackendEntityCreation(writingAndamento, { entityType: "andamento", onSuccessCb: clearAndamento });
  }

  function createTimesheet() {
    if (!timesheet) return;
    const writingTimesheet = adaptDisplayingTimesheetToWritingType(
      timesheet,
      parentDetails?.idTarefa,
      parentDetails?.tipoTarefa
    );
    dispatchBackendEntityCreation(writingTimesheet, {
      entityType: "timesheet",
      codigoProcesso: parentDetails?.codigoProcesso,
      onSuccessCb: clearTimesheet,
    });
  }

  function createNewTarefa() {
    if (!newTarefa || !parentDetails?.codigoProcesso) return; //TODO: If there is no codigoProcesso, send notification
    const writingNewTarefa = adaptDisplayingNewTarefaToWritingType(newTarefa, parentDetails.codigoProcesso);
    dispatchBackendEntityCreation(writingNewTarefa, { entityType: "newTarefa", onSuccessCb: clearNewTarefa });
  }

  function createEmptyNewTarefa(situacao: SimpleDocument) {
    return { tarefaEventoSituacaoWs: situacao } as DisplayingNewTarefa;
  }

  function setAndamentoTimesheetPanelVisibility(options: VisibilityOptions) {
    if (options.visible === true) setParentDetails(prevPd => ({ ...prevPd, ...options.parentDetails }));
    setshowAndamentoTimesheetPanel(options.visible);
  }

  function setNewTarefaPanelVisibility(options: VisibilityOptions) {
    if (options.visible === true) setParentDetails(prevPd => ({ ...prevPd, ...options.parentDetails }));
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
    pendingStatus,
    createAndamentoTimesheet,
    createNewTarefa,
    showAndamentoTimesheetPanel,
    setAndamentoTimesheetPanelVisibility,
    showNewTarefaPanel,
    setNewTarefaPanelVisibility,
  };

  return <CreateEntitiesContext.Provider value={contextContent}>{children}</CreateEntitiesContext.Provider>;
}
