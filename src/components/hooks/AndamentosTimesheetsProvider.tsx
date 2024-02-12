import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Prettify, DisplayingAndamento, DisplayingTimesheet } from "../../global";

type VisibilityOptions = { visible: false } | { visible: true; codigoProcesso: number };

type AndamentosTimesheetsContext = {
  andamento?: DisplayingAndamento;
  codigoProcesso?: number;
  showAndamentosTarefasPanel: boolean;
  timesheet?: DisplayingTimesheet;
  createAndamentoTimesheet: () => void;
  setAndamentosTarefasPanelVisibility: (options: VisibilityOptions) => void;
  updateAndamentoDetails: (keysToUpdate: Partial<DisplayingAndamento>) => void;
  updateTimesheetDetails: (keysToUpdate: Partial<DisplayingTimesheet>) => void;
};

const AndamentosTimesheetsContext = createContext<Prettify<AndamentosTimesheetsContext>>({
  showAndamentosTarefasPanel: false,
  createAndamentoTimesheet: () => {},
  setAndamentosTarefasPanelVisibility: () => {},
  updateAndamentoDetails: () => {},
  updateTimesheetDetails: () => {},
});

export function useAndamentosTimesheets() {
  return useContext(AndamentosTimesheetsContext);
}

export default function AndamentosTimesheetsProvider({ children }: PropsWithChildren) {
  const [andamento, setAndamento] = useState<DisplayingAndamento>();
  const [codigoProcesso, setCodigoProcesso] = useState(0);
  const [timesheet, setTimesheet] = useState<DisplayingTimesheet>();
  const [showAndamentosTarefasPanel, setShowAndamentosTarefasPanel] = useState(false);

  function updateAndamentoDetails(keysToUpdate: Partial<DisplayingAndamento>): void {
    setAndamento(prevValues => ({ ...prevValues, ...keysToUpdate } as DisplayingAndamento));
  }

  function updateTimesheetDetails(keysToUpdate: Partial<DisplayingTimesheet>): void {
    setTimesheet(prevValues => ({ ...prevValues, ...keysToUpdate } as DisplayingTimesheet));
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
    showAndamentosTarefasPanel,
    createAndamentoTimesheet,
    setAndamentosTarefasPanelVisibility,
    updateAndamentoDetails,
    updateTimesheetDetails,
  };

  return <AndamentosTimesheetsContext.Provider value={contextContent}>{children}</AndamentosTimesheetsContext.Provider>;
}
