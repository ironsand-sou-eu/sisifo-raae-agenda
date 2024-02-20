import AsyncSelect from "react-select/async";
import useProjurisConnector, { ProjurisOptionsFilter } from "../hooks/connectors/useProjurisConnector";
import useProjurisToReactSelectAdapter from "../hooks/adapters/useProjurisToReactSelectAdapter";
import { Marcador, Prettify, SimpleDocument, SituacaoTarefa } from "../../global";
import { debounce } from "../../utils/utils";
import ErrorDiv from "./ErrorDiv";

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
  error?: string;
  label: string;
  name: string;
  onChange: (newValue: object) => void;
  optionsEndpoint?: string;
  values?: SimpleDocument | SimpleDocument[] | Marcador | Marcador[] | SituacaoTarefa | SituacaoTarefa[];
};

export default function FetchingSelect({
  filterObject,
  hasMultiLevelSource,
  isMulti,
  error,
  label,
  name,
  onChange,
  optionsEndpoint,
  values,
}: FetchingSelectProps): JSX.Element {
  const { loadSimpleOptions, createFilterObject } = useProjurisConnector();
  const { insertValueLabel, removeValueLabel } = useProjurisToReactSelectAdapter();

  const filterFunction = debounce((input: string, callback) => {
    const selectFilter = createFilterObject({ val: input, flattenOptions: hasMultiLevelSource });
    loadSimpleOptions(optionsEndpoint, { ...selectFilter, ...filterObject })
      .then(result => callback(result))
      .catch(error => callback(error, null));
  });
  const style = error ? { borderColor: "var(--fill-color-red) !important" } : undefined;

  return (
    <div>
      <label className="sisifo-label">{label}</label>
      <ErrorDiv error={error} />
      <AsyncSelect
        loadOptions={filterFunction}
        value={insertValueLabel(values)}
        name={name}
        placeholder="Selecione uma opção..."
        onChange={newValues => onChange(removeValueLabel(newValues))}
        isSearchable
        isClearable
        isMulti={isMulti}
        defaultOptions
        cacheOptions
        classNames={{ control: () => "select-control" }}
        styles={{ control: base => ({ ...base, ...(style ?? {}) }) }}
      />
    </div>
  );
}
