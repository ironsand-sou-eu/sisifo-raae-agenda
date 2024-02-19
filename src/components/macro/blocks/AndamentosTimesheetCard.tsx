import DetailedCardHeader from "./DetailedCardHeader";
import AndamentosCard from "./AndamentosCard";
import TimesheetCard from "./TimesheetCard";
import Button from "../../micro/Button";
import { useAndamentosTimesheets } from "../../hooks/AndamentosTimesheetsProvider";
import { useMemo } from "react";

export type AndamentosTimesheetCardProps = {};

export default function AndamentosTimesheetCard() {
  const { createAndamentoTimesheet, setAndamentosTarefasPanelVisibility } = useAndamentosTimesheets();
  const { andamentoValidation, timesheetValidation } = useAndamentosTimesheets();

  const saveButtonDisabled = useMemo(() => {
    const andamentoReady = andamentoValidation && andamentoValidation.ok;
    const timesheetReady = timesheetValidation && timesheetValidation.ok;
    if (
      (andamentoReady && timesheetReady) ||
      (andamentoReady && !timesheetValidation) ||
      (!andamentoValidation && timesheetReady)
    ) {
      return false;
    }
    return true;
  }, [andamentoValidation, timesheetValidation]);

  return (
    <section className="card tarefa-card tarefa-detailed-card">
      <DetailedCardHeader
        caption={"Criar andamento e timesheet"}
        circleColor={"#9d37d3"}
        closeFunction={() => setAndamentosTarefasPanelVisibility({ visible: false })}
      />
      <AndamentosCard />
      <TimesheetCard />
      <div className="btn-container">
        <Button
          name="salvar"
          disabled={saveButtonDisabled}
          caption="Criar andamento/timesheet"
          className="btn save-btn"
          onClick={() => createAndamentoTimesheet()}
        />
      </div>
      <footer className="tarefa-card-footer">{}</footer>
    </section>
  );
}
