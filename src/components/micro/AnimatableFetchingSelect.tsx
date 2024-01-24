import { ProjurisOptionsFilter } from "../hooks/useProjurisConnector";
import { Marcador, Prettify, SimpleDocument, SituacaoTarefa } from "../../global";
import { useAnimations } from "../hooks/AnimationsProvider";
import FetchingSelect from "./FetchingSelect";
import { useEffect } from "react";

type AnimatableFetchingSelectProps = {
  condition: boolean;
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

export default function AnimatableFetchingSelect({
  condition,
  filterObject,
  hasMultiLevelSource,
  isMulti,
  label,
  name,
  onChange,
  loadingFunction,
  optionsEndpoint,
  values,
}: AnimatableFetchingSelectProps): JSX.Element {
  const { elementRef, setDisplayingAnimation } = useAnimations();

  useEffect(() => setDisplayingAnimation("colunaKanban"), [condition]);

  return (
    <>
      {condition && (
        <div ref={elementRef?.colunaKanban}>
          <FetchingSelect
            onChange={newValue => onChange(newValue)}
            {...{ optionsEndpoint, hasMultiLevelSource, filterObject, values, name, label, isMulti, loadingFunction }}
          />
        </div>
      )}
    </>
  );
}
