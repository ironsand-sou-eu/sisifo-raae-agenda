import AsyncSelect from "react-select/async";
import useProjurisConnector, { ProjurisOptionsFilter } from "../hooks/useProjurisConnector";
import useProjurisAdapter from "../hooks/useProjurisAdapter";
import { Marcador, Prettify, SimpleDocument, SituacaoTarefa } from "../../global";

export type SelectValue = Prettify<
  {
    value: number;
    label: string;
  } & (Partial<SimpleDocument> | Partial<Marcador> | Partial<SituacaoTarefa>)
>;

type FetchingSelectProps = {
  filterObject?: Prettify<Partial<ProjurisOptionsFilter>>;
  hasMultiLevelSource: boolean;
  isMulti: boolean;
  label: string;
  name: string;
  onChange: (newValue: object) => void;
  loadingFunction?: (input: string) => Promise<any[]>;
  optionsEndpoint?: string;
  values?: SimpleDocument[] | Marcador[] | SituacaoTarefa[];
};

export default function FetchingSelect({
  filterObject,
  hasMultiLevelSource,
  isMulti,
  label,
  name,
  onChange,
  loadingFunction,
  optionsEndpoint,
  values,
}: FetchingSelectProps): JSX.Element {
  const { loadSimpleOptions, createFilterObject } = useProjurisConnector();
  const { insertValueLabel, removeValueLabel } = useProjurisAdapter();

  const filterFunction =
    loadingFunction ??
    async function (input: string) {
      const selectFilter = createFilterObject({ val: input, flattenOptions: hasMultiLevelSource });
      return loadSimpleOptions(optionsEndpoint, { ...selectFilter, ...filterObject });
    };

  return (
    <div>
      <label className="sisifo-label">{label}</label>
      <AsyncSelect
        loadOptions={filterFunction}
        value={insertValueLabel(values)}
        name={name}
        placeholder="Selecione uma opção..."
        onChange={newValues => onChange(removeValueLabel(newValues))}
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
