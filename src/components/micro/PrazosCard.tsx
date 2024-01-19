import { ReceivedTarefaDetails } from "../../global";
import SingleDatePicker from "./SingleDatePicker";

export type PrazosCardProps = {
  dataConclusao?: Date | null;
  dataConclusaoPrevista?: Date | null;
  dataLimite?: Date | null;
  onChange: (key: keyof ReceivedTarefaDetails["tarefaEventoWs"], newValue: unknown) => void;
  prazoColorCssVariable: string;
};

export default function PrazosCard({
  dataConclusao,
  dataConclusaoPrevista,
  dataLimite,
  onChange,
  prazoColorCssVariable,
}: PrazosCardProps): JSX.Element {
  return (
    <div className={"prazos-card"} style={{ borderColor: `var(${prazoColorCssVariable})` }}>
      <SingleDatePicker
        label="Prazo"
        onChange={(newValue: Date) => onChange("dataConclusaoPrevista", newValue?.getTime())}
        date={dataConclusaoPrevista}
      />
      <SingleDatePicker label="Fatal" onChange={(newValue: Date) => onChange("dataLimite", newValue?.getTime() ?? null)} date={dataLimite} />
      <SingleDatePicker
        label="Cumprimento"
        onChange={(newValue: Date) => onChange("dataConclusao", newValue?.getTime() ?? null)}
        date={dataConclusao}
      />
    </div>
  );
}

// TODO: codigoUsuarioCriador: 89323
