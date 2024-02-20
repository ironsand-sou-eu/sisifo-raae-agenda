import { Prettify } from "../../../global";
import { SelectValue } from "../../micro/FetchingSelect";
import { Filter } from "../providers/FiltersProvider";
import { Marcador, SimpleDocument, SituacaoTarefa } from "../../../global";

export type InsertValueLabelParams = Prettify<SimpleDocument | Marcador | SituacaoTarefa | Filter>;

export default function useProjurisToReactSelectAdapter() {
  function insertValueLabel(projurisEntities?: InsertValueLabelParams | InsertValueLabelParams[]): SelectValue[] {
    if (!projurisEntities) return [];
    const projurisEntitiesArray = Array.isArray(projurisEntities) ? projurisEntities : [projurisEntities];
    if (!projurisEntitiesArray.length) return [];
    if (projurisEntitiesArray.length === 1) {
      if ("valor" in projurisEntitiesArray[0] && projurisEntitiesArray[0].valor === "") return [];
      if ("filterName" in projurisEntitiesArray[0] && projurisEntitiesArray[0].filterName === "") return [];
      if ("nomeMarcador" in projurisEntitiesArray[0] && projurisEntitiesArray[0].nomeMarcador === "") return [];
      if ("nomeTipoTarefa" in projurisEntitiesArray[0] && projurisEntitiesArray[0].nomeTipoTarefa === "") return [];
    }
    return projurisEntitiesArray.map(obj => {
      let value, label;
      if ("codigoMarcador" in obj) {
        label = obj.nomeMarcador;
        value = obj.codigoMarcador;
      } else if ("codigoTarefaTipo" in obj) {
        label = obj.nomeTipoTarefa;
        value = obj.codigoTarefaTipo;
      } else if ("filterName" in obj) {
        label = obj.filterName;
        value = obj.index;
      } else {
        label = obj.valor;
        value = obj.chave;
      }
      return {
        ...obj,
        value,
        label,
      };
    });
  }

  function removeValueLabel(object: any): object {
    if (!object) return object;
    if (Array.isArray(object)) return object.map(obj => removeValueLabel(obj));
    const { value, label, ...others } = object;
    return others;
  }

  return { insertValueLabel, removeValueLabel };
}
