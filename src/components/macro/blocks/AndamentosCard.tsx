import useProjurisConnector from "../../hooks/connectors/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import Textarea from "../../micro/Textarea";
import { SimpleDocument } from "../../../global";
import SingleDatePicker from "../../micro/SingleDatePicker";
import HeaderButton from "../../micro/HeaderButton";
import { CreateEntitiesContext, useCreateEntities } from "../../hooks/providers/CreateEntitiesProvider";

export default function AndamentosCard() {
  const { andamento, andamentoValidation, clearAndamento, updateAndamento } =
    useCreateEntities() as CreateEntitiesContext;
  const { endpoints } = useProjurisConnector();

  const { dataHoraAndamento, descricaoAndamento, responsaveis, tipoAndamento } = andamento ?? {};

  return (
    <section>
      <header>
        <h3 title="Você pode criar apenas andamento, apenas timesheet ou ambos">Andamento</h3>
        <HeaderButton type="delete" onClick={clearAndamento} className="small-button" title="Limpar andamento" />
      </header>
      <FetchingSelect
        optionsEndpoint={endpoints.tiposAndamento}
        hasMultiLevelSource={false}
        values={tipoAndamento}
        onChange={newValue => updateAndamento({ tipoAndamento: newValue as SimpleDocument })}
        name="tipo-andamento"
        label="Tipo de andamento"
        error={andamentoValidation?.errors?.tipoAndamento}
        isMulti={false}
      />

      <SingleDatePicker
        label="Data e hora"
        id="andamento-datepicker"
        date={dataHoraAndamento}
        onChange={newValue => updateAndamento({ dataHoraAndamento: newValue })}
        error={andamentoValidation?.errors?.dataHoraAndamento}
        showTimeInput
        dateFormat="dd/MM/yyyy HH:mm"
        timeInputLabel="Hora:"
        timeFormat="p"
        showIcon
        closeOnScroll
      />

      <Textarea
        name="descricao-andamento"
        label="Descrição"
        onChange={ev => updateAndamento({ descricaoAndamento: ev.target.value })}
        content={descricaoAndamento}
        error={andamentoValidation?.errors?.descricaoAndamento}
      />

      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={responsaveis}
        onChange={newValue => updateAndamento({ responsaveis: newValue as [SimpleDocument, ...SimpleDocument[]] })}
        error={andamentoValidation?.errors?.responsaveis}
        name="responsaveis"
        label="Responsáveis"
        isMulti={true}
      />
    </section>
  );
}
