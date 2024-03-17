import useProjurisConnector from "../../hooks/connectors/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import Textarea from "../../micro/Textarea";
import { SimpleDocument } from "../../../global";
import MaskedNumberInput from "../../micro/MaskedNumberInput";
import { maskNumbersString } from "../../../utils/utils";
import Checkbox from "../../micro/Checkbox";
import SingleDatePicker from "../../micro/SingleDatePicker";
import { CreateEntitiesContext, useCreateEntities } from "../../hooks/providers/CreateEntitiesProvider";
import HeaderButton from "../../micro/HeaderButton";

export default function TimesheetCard() {
  const { timesheet, timesheetValidation, clearTimesheet, updateTimesheet } =
    useCreateEntities() as CreateEntitiesContext;
  const { endpoints } = useProjurisConnector();
  const timesheetHoursAmountMask = "00:00";
  const { dataHoraApontamento, descricaoApontamento, faturar, tipoLancamento, responsavel, qtdHoras } = timesheet ?? {};

  return (
    <section>
      <header>
        <h3 title="Você pode criar apenas andamento, apenas timesheet ou ambos">Timesheet</h3>
        <HeaderButton type="delete" onClick={clearTimesheet} className="small-button" title="Limpar timesheet" />
      </header>
      <FetchingSelect
        optionsEndpoint={endpoints.timesheet.consultarTiposLancamento}
        hasMultiLevelSource={false}
        values={tipoLancamento}
        onChange={newValue => updateTimesheet({ tipoLancamento: newValue as SimpleDocument })}
        error={timesheetValidation?.errors.tipoLancamento}
        name="tipo-timesheet"
        label="Tipo de lançamento"
        isMulti={false}
      />

      <SingleDatePicker
        label="Data e hora"
        id="timesheet-datepicker"
        date={dataHoraApontamento}
        onChange={newValue => updateTimesheet({ dataHoraApontamento: newValue })}
        error={timesheetValidation?.errors?.dataHoraApontamento}
        dateFormat="dd/MM/yyyy HH:mm"
        showTimeInput
        timeInputLabel="Hora:"
        timeFormat="p"
        showIcon
        closeOnScroll
      />

      <MaskedNumberInput
        label={"Quantidade de horas"}
        className="datepicker-input text-center"
        mask={timesheetHoursAmountMask}
        placeholder={timesheetHoursAmountMask}
        name={"qtd-horas"}
        value={qtdHoras}
        onChange={ev => updateTimesheet({ qtdHoras: maskNumbersString(ev.target.value, timesheetHoursAmountMask) })}
        error={timesheetValidation?.errors?.qtdHoras}
      />

      <Textarea
        name="descricao-timesheet"
        label="Descrição"
        onChange={ev => updateTimesheet({ descricaoApontamento: ev.target.value })}
        content={descricaoApontamento}
        error={timesheetValidation?.errors?.descricaoApontamento}
      />

      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={responsavel}
        onChange={newValue => updateTimesheet({ responsavel: newValue as SimpleDocument })}
        error={timesheetValidation?.errors?.responsavel}
        name="responsavel"
        label="Responsável"
        isMulti={false}
      />

      <Checkbox
        name="faturar"
        label="Pronto para faturar"
        checked={faturar}
        onChange={ev => updateTimesheet({ faturar: ev.target.checked })}
      />
    </section>
  );
}
