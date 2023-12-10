import AsyncSelect from "react-select/async";
import useProjurisConnector, {
  Marcador,
  ProjurisOptionsFilter,
  SimpleDocument,
  SituacaoTarefa,
} from "../hooks/useProjurisConnector";
import useProjurisAdapter from "../hooks/useProjurisAdapter";

export type SelectValue = {
  value: number;
  label: string;
} & (Partial<SimpleDocument> | Partial<Marcador> | Partial<SituacaoTarefa>);

type FetchingSelectProps = {
  hasMultiLevelSource: boolean;
  name: string;
  label: string;
  isMulti: boolean;
  optionsEndpoint?: string;
  values?: SimpleDocument[] | Marcador[] | SituacaoTarefa[];
};

export default function FetchingSelect({
  optionsEndpoint,
  hasMultiLevelSource,
  name,
  label,
  values,
  isMulti,
}: FetchingSelectProps): JSX.Element {
  const { loadSimpleOptions } = useProjurisConnector();
  const { insertValueLabel, removeValueLabel } = useProjurisAdapter();

  const filterFunction = (input: string) =>
    loadSimpleOptions(optionsEndpoint, {
      key: "valor",
      operator: "insentiviveIncludes",
      val: input,
      flattenOptions: hasMultiLevelSource,
    });
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
      <label className="sisifo-label">{label}</label>
      <AsyncSelect
        loadOptions={filterFunction}
        value={insertValueLabel(values)}
        name={name}
        placeholder="Selecione uma opção..."
        // onChange={changed}
        // isLoading={isLoading.scrapping ?? true}
        isSearchable
        isClearable
        isMulti={isMulti ? true : false}
        defaultOptions
        cacheOptions
        classNames={{ control: () => "select-control" }}
      />
    </div>
  );
}
