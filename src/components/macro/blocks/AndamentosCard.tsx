import useProjurisConnector from "../../hooks/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import Textarea from "../../micro/Textarea";
import DatePicker from "react-datepicker";
import { SimpleDocument, DisplayingAndamento } from "../../../global";

export type AndamentosCardProps = (Partial<DisplayingAndamento> | undefined) & {
  updateAndamentoDetails: (newProps: Partial<DisplayingAndamento>) => void;
};

export default function AndamentosCard({
  dataHoraAndamento,
  descricaoAndamento,
  responsaveis,
  tipoAndamento,
  updateAndamentoDetails,
}: AndamentosCardProps) {
  const { endpoints } = useProjurisConnector();

  return (
    <section>
      <h3 title="Você pode criar apenas andamento, apenas timesheet ou ambos">Andamento</h3>
      <FetchingSelect
        optionsEndpoint={endpoints.tiposAndamento}
        hasMultiLevelSource={false}
        values={tipoAndamento ? [tipoAndamento] : undefined}
        onChange={newValue => updateAndamentoDetails({ tipoAndamento: newValue })}
        name="tipo-andamento"
        label="Tipo de andamento"
        isMulti={false}
      />
      <div>
        <label className="sisifo-label" htmlFor="andamento-datepicker">
          Data e hora
        </label>
        <DatePicker
          id="andamento-datepicker"
          selected={dataHoraAndamento}
          locale={"pt-BR"}
          onChange={newValue => updateAndamentoDetails({ dataHoraAndamento: newValue })}
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

      <Textarea
        name="descricao-andamento"
        label="Descrição"
        onChange={ev => updateAndamentoDetails({ descricaoAndamento: ev.target.value })}
        content={descricaoAndamento}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={responsaveis}
        onChange={newValue => updateAndamentoDetails({ responsaveis: newValue as SimpleDocument[] })}
        name="responsaveis"
        label="Responsáveis"
        isMulti={true}
      />
    </section>
  );
}
