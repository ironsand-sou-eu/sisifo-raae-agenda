import DatePicker from "react-datepicker";
import useProjurisConnector from "../../hooks/connectors/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import { FiltersContext, useFilters } from "../../hooks/providers/FiltersProvider";

export default function HeaderFilterBody(): JSX.Element {
  const { filters, changeCurrentFilter } = useFilters() as FiltersContext;
  const { quadroKanban, tipos, responsaveis, gruposTrabalho, situacao, dates, nextXDays } =
    filters?.currentFilter ?? {};
  const { endpoints } = useProjurisConnector();
  // SELECT SINGLE Categoria de registro (tarefa, andamento, timesheet)

  return (
    <>
      <div className="filter-body">
        <div className="date-row">
          <div>
            <label title="(Negativo para os últimos X dias)" className="sisifo-label" htmlFor="nextXDays">
              Próximos X dias
            </label>
            <input
              className="datepicker-input"
              type="number"
              name="nextXdays"
              id="nextXdays"
              value={nextXDays ?? ""}
              onChange={({ target: { value } }) => changeCurrentFilter(value ? parseInt(value) : null, "nextXDays")}
            />
          </div>
          <div>
            <label className="sisifo-label" htmlFor="filter-datepicker">
              Datas inicial e final
            </label>
            <DatePicker
              id="filter-datepicker"
              selectsRange={true}
              startDate={dates ? dates[0] : null}
              endDate={dates ? dates[1] : null}
              onChange={dates => changeCurrentFilter(dates, "dates")}
              wrapperClassName="datepicker-wrapper"
              className="datepicker-input"
              dateFormat={"dd/MM/yyyy"}
              showIcon
              closeOnScroll
            />
          </div>
        </div>
        <FetchingSelect
          optionsEndpoint={endpoints.tarefa.consultarSituacoes}
          hasMultiLevelSource={false}
          values={situacao}
          onChange={newValues => changeCurrentFilter(newValues, "situacao")}
          name="situacao"
          label="Situação da tarefa"
          isMulti={false}
        />
        <FetchingSelect
          optionsEndpoint={endpoints.kanban.consultarQuadros}
          hasMultiLevelSource={false}
          values={quadroKanban}
          onChange={newValues => changeCurrentFilter(newValues, "quadroKanban")}
          name="quadro-kanban"
          label="Quadro kanban"
          isMulti={false}
        />
        <FetchingSelect
          optionsEndpoint={endpoints.tarefa.consultarTipos}
          hasMultiLevelSource={false}
          values={tipos}
          onChange={newValues => changeCurrentFilter(newValues, "tipos")}
          name="tipo-tarefa"
          label="Tipo de tarefa"
          isMulti={true}
        />
        <FetchingSelect
          optionsEndpoint={endpoints.gruposTrabalho}
          hasMultiLevelSource={false}
          values={gruposTrabalho}
          onChange={newValues => changeCurrentFilter(newValues, "gruposTrabalho")}
          name="grupos-trabalho"
          label="Grupos de trabalho"
          isMulti={true}
        />
        <FetchingSelect
          optionsEndpoint={endpoints.responsaveis}
          hasMultiLevelSource={false}
          values={responsaveis}
          onChange={newValues => changeCurrentFilter(newValues, "responsaveis")}
          name="responsaveis"
          label="Responsáveis"
          isMulti={true}
        />
      </div>
      &nbsp;
    </>
  );
}
