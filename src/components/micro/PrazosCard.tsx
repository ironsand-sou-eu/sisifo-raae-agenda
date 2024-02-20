import { FetchedTarefaDetails, PartialOrNullable } from "../../global";
import { DisplayingNewTarefa } from "../../global.zod";
import SingleDatePicker from "./SingleDatePicker";

export type PrazosCardProps = {
  dataConclusao?: Date | null;
  dataConclusaoPrevista?: Date | null;
  dataLimite?: Date | null;
  dateAsNumber: boolean;
  onChange:
    | ((keysToUpdate: Partial<FetchedTarefaDetails["tarefaEventoWs"]>) => void)
    | ((keysToUpdate: PartialOrNullable<DisplayingNewTarefa>) => void);
  prazoColorCssVariable: string;
};

export default function PrazosCard({
  dataConclusao,
  dataConclusaoPrevista,
  dataLimite,
  dateAsNumber,
  onChange,
  prazoColorCssVariable,
}: PrazosCardProps): JSX.Element {
  function handleChange(newValue: Date, keyToUpdate: string) {
    onChange({ [keyToUpdate]: dateAsNumber ? newValue.getTime() : newValue });
  }

  return (
    <div className={"prazos-card"} style={{ borderColor: `var(${prazoColorCssVariable})` }}>
      <SingleDatePicker
        label="Prazo"
        onChange={(newValue: Date) => handleChange(newValue, "dataConclusaoPrevista")}
        date={dataConclusaoPrevista}
      />
      <SingleDatePicker
        label="Fatal"
        onChange={(newValue: Date) => handleChange(newValue, "dataLimite")}
        date={dataLimite}
      />
      <SingleDatePicker
        label="Cumprimento"
        onChange={(newValue: Date) => handleChange(newValue, "dataConclusao")}
        date={dataConclusao}
        readOnly={true}
      />
    </div>
  );
}

// TODO: codigoUsuarioCriador: 89323
