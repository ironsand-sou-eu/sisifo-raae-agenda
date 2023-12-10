import Select from "react-select";
import { Marcador, SimpleDocument, SituacaoTarefa } from "../hooks/useProjurisConnector";
import useProjurisAdapter, { InsertValueLabelParams } from "../hooks/useProjurisAdapter";

export type SelectValue = {
  value: number;
  label: string;
} & (Partial<SimpleDocument> | Partial<Marcador> | Partial<SituacaoTarefa>);

type FixedSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  options?: InsertValueLabelParams[];
  values?: SimpleDocument[] | Marcador[] | SituacaoTarefa[];
  isMulti: boolean;
};

export default function FixedSelect({
  name,
  label,
  placeholder,
  options,
  values,
  isMulti,
}: FixedSelectProps): JSX.Element {
  const { insertValueLabel, removeValueLabel } = useProjurisAdapter();

  const filterFunction = (input: string) => {};
  // async function changed(newData) {
  //   if (name !== "gruposDeTrabalho" || newData === null)
  //     return onChange(removeValueLabel(newData), name);
  //   try {
  //     const gtCrew = await getGtCrew(newData.label, props?.allResponsaveis);
  //     const responsaveis = gtCrew?.advs;
  //     onChange(removeValueLabel(responsaveis), "responsaveis");
  //     onChange(removeValueLabel(newData), name);
  //   } catch (e) {
  //     msgSetter.addMsg({ type: "fail", msg: e });
  //     return onChange(removeValueLabel(newData), name);
  //   }
  // }

  return (
    <div>
      {label && <label className="sisifo-label">{label}</label>}
      <Select
        options={insertValueLabel(options)}
        value={insertValueLabel(values)}
        name={name}
        placeholder={placeholder ?? "Selecione uma opção..."}
        // onChange={changed}
        // isLoading={isLoading.scrapping ?? true}
        isSearchable
        isClearable
        isMulti={isMulti ? true : false}
        classNames={{ control: () => "select-control" }}
      />
    </div>
  );
}
