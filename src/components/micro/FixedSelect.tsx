import Select from "react-select";
import { Marcador, SimpleDocument, SituacaoTarefa } from "../../global";
import useProjurisAdapter, { InsertValueLabelParams } from "../hooks/useProjurisAdapter";
import { Prettify } from "../../global";

export type SelectValue = Prettify<
  {
    value: number;
    label: string;
  } & (Partial<SimpleDocument> | Partial<Marcador> | Partial<SituacaoTarefa>)
>;

type FixedSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  options?: Prettify<InsertValueLabelParams>[];
  values?: Prettify<InsertValueLabelParams>[];
  onChange: (args: any) => void;
  isMulti: boolean;
};

export default function FixedSelect({ name, label, placeholder, options, values, onChange, isMulti }: FixedSelectProps): JSX.Element {
  const { insertValueLabel, removeValueLabel } = useProjurisAdapter();

  return (
    <>
      {label && <label className="sisifo-label">{label}</label>}
      <Select
        options={insertValueLabel(options)}
        value={insertValueLabel(values)}
        name={name}
        placeholder={placeholder ?? "Selecione uma opção..."}
        onChange={args => onChange(removeValueLabel(args))}
        // isLoading={isLoading.scrapping ?? true}
        isSearchable
        isClearable
        isMulti={isMulti ? true : false}
        classNames={{ control: () => "select-control" }}
      />
    </>
  );
}
