import useProjurisConnector from "../../hooks/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import Textarea from "../../micro/Textarea";
import DatePicker from "react-datepicker";
import { DisplayingTimesheet } from "../../../global";
import MaskedNumberInput from "../../micro/MaskedNumberInput";
import { maskNumbersString } from "../../../utils/utils";
import Checkbox from "../../micro/Checkbox";

export type TimesheetCardProps = (Partial<DisplayingTimesheet> | undefined) & {
  updateTimesheetDetails: (newProps: Partial<DisplayingTimesheet>) => void;
};

export default function TimesheetCard({
  dataHoraApontamento,
  descricaoApontamento,
  faturar,
  tipoLancamento,
  responsavel,
  qtdHoras,
  updateTimesheetDetails,
}: TimesheetCardProps) {
  const { endpoints } = useProjurisConnector();
  const timesheetHoursAmountMask = "00:00";

  return (
    <section>
      <h3 title="Você pode criar apenas andamento, apenas timesheet ou ambos">Timesheet</h3>
      <FetchingSelect
        optionsEndpoint={endpoints.tiposLancamentoTimesheet}
        hasMultiLevelSource={false}
        values={tipoLancamento ? [tipoLancamento] : undefined}
        onChange={newValue => updateTimesheetDetails({ tipoLancamento: newValue })}
        name="tipo-timesheet"
        label="Tipo de lançamento"
        isMulti={false}
      />

      <div>
        <label className="sisifo-label" htmlFor="andamento-datepicker">
          Data e hora
        </label>
        <DatePicker
          id="andamento-datepicker"
          selected={dataHoraApontamento}
          locale={"pt-BR"}
          onChange={newValue => updateTimesheetDetails({ dataHoraApontamento: newValue })}
          wrapperClassName="datepicker-wrapper"
          className="datepicker-input"
          dateFormat={"dd/MM/yyyy"}
          showTimeInput
          timeInputLabel="Hora:"
          timeFormat="p"
          showIcon
          closeOnScroll
        />
      </div>

      <MaskedNumberInput
        label={"Quantidade de horas"}
        className="datepicker-input"
        mask={timesheetHoursAmountMask}
        placeholder={timesheetHoursAmountMask}
        name={"qtd-horas"}
        value={qtdHoras}
        onChange={ev =>
          updateTimesheetDetails({ qtdHoras: maskNumbersString(ev.target.value, timesheetHoursAmountMask) })
        }
      />

      <Textarea
        name="descricao-timesheet"
        label="Descrição"
        onChange={ev => updateTimesheetDetails({ descricaoApontamento: ev.target.value })}
        content={descricaoApontamento}
      />

      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={responsavel}
        onChange={newValue => updateTimesheetDetails({ responsavel: newValue })}
        name="responsavel"
        label="Responsável"
        isMulti={false}
      />

      <Checkbox
        name="faturar"
        label="Pronto para faturar"
        checked={faturar}
        onChange={ev => updateTimesheetDetails({ faturar: ev.target.checked })}
      />
    </section>
  );
}
