import { useEffect } from "react";
import DatePicker from "react-datepicker";
import useProjurisConnector from "../hooks/useProjurisConnector";
import FetchingSelect from "../micro/FetchingSelect";
import envVars from "../../envVars";
import { useFilterAnimations } from "../hooks/FilterAnimationsProvider";
import { useFilters } from "../hooks/FiltersProvider";

export default function TopFilterBody(): JSX.Element {
  const { filters } = useFilters();
  const { quadroKanban, colunaKanban, tipos, responsaveis, gruposTrabalho, situacoes, startDate, endDate } =
    filters?.currentFilter ?? {};
  const { endpoints } = useProjurisConnector();
  const { bodyDivRef, setBodyDisplayingAnimation } = useFilterAnimations();
  // SELECT SINGLE Categoria de registro (tarefa, andamento, timesheet)

  useEffect(() => setBodyDisplayingAnimation(), []);

  return (
    <div ref={bodyDivRef} className="filter-body">
      <label className="sisifo-label" htmlFor="filter-datepicker">
        Datas inicial e final
      </label>
      <DatePicker
        id="filter-datepicker"
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={() => {}}
        wrapperClassName="datepicker-wrapper"
        className="datepicker-input"
        // onChange={twoDatesArrayupdate => {
        //   setDateRange(twoDatesArrayupdate);
        // }}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.situacoesTarefa}
        hasMultiLevelSource={false}
        values={situacoes}
        name="situacao"
        label="Situação da tarefa"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.quadrosKanban(envVars.CODIGO_USUARIO)}
        hasMultiLevelSource={false}
        values={quadroKanban ? [quadroKanban] : undefined}
        name="quadro-kanban"
        label="Quadro kanban"
        isMulti={false}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.colunasKanban(filters?.currentFilter?.quadroKanban?.chave)}
        hasMultiLevelSource={false}
        values={colunaKanban ? [colunaKanban] : undefined}
        name="coluna-kanban"
        label="Coluna kanban"
        isMulti={false}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.tiposTarefa}
        hasMultiLevelSource={false}
        values={tipos}
        name="tipo-tarefa"
        label="Tipo de tarefa"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.gruposTrabalho}
        hasMultiLevelSource={false}
        values={gruposTrabalho}
        name="grupos-trabalho"
        label="Grupos de trabalho"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={responsaveis}
        name="responsaveis"
        label="Responsáveis"
        isMulti={true}
      />
    </div>
  );
}
