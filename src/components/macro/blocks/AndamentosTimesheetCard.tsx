import DetailedCardHeader from "./DetailedCardHeader";
import AndamentosCard from "./AndamentosCard";
import TimesheetCard from "./TimesheetCard";
import Button from "../../micro/Button";
import { useAndamentosTimesheets } from "../../hooks/AndamentosTimesheetsProvider";

export type AndamentosTimesheetCardProps = {};

export default function AndamentosTimesheetCard() {
  const {
    andamento,
    timesheet,
    updateAndamentoDetails,
    updateTimesheetDetails,
    createAndamentoTimesheet,
    setAndamentosTarefasPanelVisibility,
  } = useAndamentosTimesheets();

  return (
    <section className="card tarefa-card tarefa-detailed-card">
      <DetailedCardHeader
        caption={"Criar andamento e timesheet"}
        circleColor={"#9d37d3"}
        closeFunction={() => setAndamentosTarefasPanelVisibility({ visible: false })}
      />
      <AndamentosCard {...{ ...andamento, updateAndamentoDetails }} />
      <TimesheetCard {...{ ...timesheet, updateTimesheetDetails }} />
      <div className="btn-container">
        <Button
          name="salvar"
          caption="Salvar alterações"
          className="btn save-btn"
          onClick={() => createAndamentoTimesheet()}
        />
      </div>
      <footer className="tarefa-card-footer">{}</footer>
    </section>
  );
}
